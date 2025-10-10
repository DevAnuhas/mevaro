import { streamText } from 'ai';
import { google } from '@ai-sdk/google';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { GetObjectCommand } from '@aws-sdk/client-s3';
import { r2 } from '@/lib/r2';

export const maxDuration = 60;

export async function POST(req: NextRequest) {
    try {
        const { materialId } = await req.json();

        if (!materialId) {
            return new Response('Material ID is required', { status: 400 });
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
            return new Response('Material not found', { status: 404 });
        }

        // Extract the file key from the URL
        const fileKey = material.fileUrl.split('/').pop();
        if (!fileKey) {
            return new Response('Invalid file URL', { status: 400 });
        }

        // Download file from R2
        const command = new GetObjectCommand({
            Bucket: process.env.CLOUDFLARE_R2_BUCKET,
            Key: fileKey,
        });

        const response = await r2.send(command);
        const fileBuffer = await response.Body?.transformToByteArray();

        if (!fileBuffer) {
            return new Response('Failed to download file', { status: 500 });
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

        // Create the prompt for summarization
        const promptText = `You are an expert educational content analyzer. Your task is to generate a comprehensive yet concise summary of the following educational material.

        Material Information:
        - Title: ${material.title}
        - Category: ${material.category}
        - Description: ${material.description || 'Not provided'}
        - Keywords: ${material.keywords.join(', ')}

        Please analyze the attached document and provide a well-structured summary that includes:
        1. A brief overview of the main topic
        2. Key concepts and learning objectives (as bullet points)
        3. Important details or findings
        4. Intended audience or learning level
        5. Practical applications or relevance (as code snippets if applicable)

        Keep the summary informative yet accessible, suitable for students and educators.`;

        // Stream the AI response with file input using multimodal content
        const result = streamText({
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
            temperature: 0.7,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error in summarization API:', error);
        return new Response(
            error instanceof Error ? error.message : 'Internal server error',
            { status: 500 }
        );
    }
}
