import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';
import { z } from 'zod';

export const maxDuration = 60;

const lessonPlanSchema = z.object({
    sections: z.array(
        z.object({
            title: z.string(),
            duration: z.string(),
            content: z.array(z.string()),
        })
    ),
    totalDuration: z.string(),
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

        // Create the prompt for lesson plan generation
        const promptText = `You are an expert educational curriculum designer and instructional planner. Your task is to create a comprehensive, well-structured lesson plan based on the following educational material.

        Material Information:
        - Title: ${material.title}
        - Category: ${material.category}
        - Description: ${material.description || 'Not provided'}
        - Keywords: ${material.keywords.join(', ')}

        Please analyze the attached document and create a detailed lesson plan with 4-6 sections that:
        1. Follow a logical teaching progression (introduction → core concepts → application → review)
        2. Include realistic time estimates for each section (in minutes)
        3. Break down each section into specific, actionable teaching points (3-5 points per section)
        4. Cover all key concepts from the material
        5. Include engaging activities, demonstrations, or discussions where appropriate
        6. End with a review and assessment section

        For each section, provide:
        - A clear, descriptive title
        - Duration in the format "X minutes" (be realistic - typical class is 45-90 minutes total)
        - 3-5 specific teaching points or activities as an array of strings

        Also calculate and provide the total duration of the entire lesson plan in the format "X minutes".

        Make sure the lesson plan is practical, engaging, and pedagogically sound. The content array should contain specific, actionable items that a teacher can follow.`;

        // Generate lesson plan using structured output
        const result = await generateObject({
            model: google('gemini-2.5-flash'),
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
            schema: lessonPlanSchema,
            temperature: 0.7,
        });

        return Response.json(result.object);
    } catch (error) {
        console.error('Error in lesson plan generation API:', error);
        return Response.json(
            { error: error instanceof Error ? error.message : 'Internal server error' },
            { status: 500 }
        );
    }
}
