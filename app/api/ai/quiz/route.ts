import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';
import { z } from 'zod';

export const maxDuration = 60;

const quizSchema = z.object({
    questions: z.array(
        z.object({
            id: z.number(),
            question: z.string(),
            options: z.array(z.string()).length(4),
            correctAnswer: z.number().min(0).max(3),
            explanation: z.string().optional(),
        })
    ),
});

export async function POST(req: NextRequest) {
    try {
        const { materialId } = await req.json();

        if (!materialId) {
            return Response.json({ error: 'Material ID is required' }, { status: 400 });
        }

        // Fetch material from database
        const material = await prisma.material.findUnique({
            where: { id: materialId },
            select: {
                id: true,
                title: true,
                description: true,
                fileUrl: true,
                fileType: true,
                category: true,
                keywords: true,
            },
        });

        if (!material) {
            return Response.json({ error: 'Material not found' }, { status: 404 });
        }

        // Extract the file key from the URL
        const fileKey = material.fileUrl.split('/').pop();
        if (!fileKey) {
            return Response.json({ error: 'Invalid file URL' }, { status: 400 });
        }

        // Download file from R2
        const command = new GetObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET,
            Key: fileKey,
        });

        const response = await r2.send(command);
        const fileBuffer = await response.Body?.transformToByteArray();

        if (!fileBuffer) {
            return Response.json({ error: 'Failed to download file' }, { status: 500 });
        }

        // Convert to base64 data URL for direct file input to AI model
        const fileBase64 = Buffer.from(fileBuffer).toString('base64');

        // Determine MIME type based on file type
        const mimeTypeMap: Record<string, string> = {
            'pdf': 'application/pdf',
            'png': 'image/png',
            'jpg': 'image/jpeg',
            'jpeg': 'image/jpeg',
            'gif': 'image/gif',
            'webp': 'image/webp',
        };
        const mimeType = mimeTypeMap[material.fileType.toLowerCase()] || 'application/pdf';

        // Create data URL
        const dataUrl = `data:${mimeType};base64,${fileBase64}`;

        // Create the prompt for quiz generation
        const promptText = `You are an expert educational assessment creator. Your task is to generate a comprehensive quiz based on the following educational material.

        Material Information:
        - Title: ${material.title}
        - Category: ${material.category}
        - Description: ${material.description || 'Not provided'}
        - Keywords: ${material.keywords.join(', ')}

        Please analyze the attached document and create a quiz with 5 multiple-choice questions that:
        1. Test key concepts and learning objectives
        2. Cover different difficulty levels (from basic recall to application)
        3. Include clear, unambiguous questions
        4. Provide 4 answer options for each question with only one correct answer
        5. Ensure distractors (wrong answers) are plausible but clearly incorrect

        For each question:
        - Make the question clear and specific
        - Ensure options are roughly the same length
        - Avoid "all of the above" or "none of the above" options
        - Provide an optional brief explanation for the correct answer

        Number the questions from 1 to 5, and number the answer options from 0 to 3 (where 0 is the first option).`;

        // Generate quiz using structured output
        const result = await generateObject({
            model: google('gemini-2.0-flash-exp'),
            messages: [
                {
                    role: 'user',
                    content: [
                        { type: 'text', text: promptText },
                        {
                            type: 'image',
                            image: dataUrl,
                        },
                    ],
                },
            ],
            schema: quizSchema,
            temperature: 0.8,
        });

        return Response.json(result.object);
    } catch (error) {
        console.error('Error in quiz generation API:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
