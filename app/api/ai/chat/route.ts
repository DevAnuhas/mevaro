import { streamText, convertToModelMessages, UIMessage } from 'ai';
import { google } from '@ai-sdk/google';
import { prisma } from '@/lib/prisma';

export const maxDuration = 60;

export async function POST(req: Request) {
    try {
        const { messages, materialId }: { messages: UIMessage[], materialId: string } = await req.json();

        if (!materialId) {
            return new Response('Material ID is required', { status: 400 });
        }

        // Fetch material context
        const material = await prisma.material.findUnique({
            where: { id: materialId },
            select: {
                title: true,
                description: true,
                category: true,
                keywords: true,
            },
        });

        if (!material) {
            return new Response('Material not found', { status: 404 });
        }

        // Create system prompt with material context
        const systemPrompt = `You are a helpful educational AI assistant. You're helping students understand educational material about "${material.title}" in the ${material.category} category.

        Material context:
        - Title: ${material.title}
        - Description: ${material.description || 'Not provided'}
        - Keywords: ${material.keywords.join(', ')}

        Your role is to:
        - Answer questions clearly and concisely
        - Provide explanations suitable for learners
        - Use examples when helpful
        - Stay focused on the educational content
        - Be encouraging and supportive`;

        // Stream the AI response
        const result = streamText({
            model: google('gemini-2.5-flash'),
            system: systemPrompt,
            messages: convertToModelMessages(messages),
            temperature: 0.7,
        });

        return result.toUIMessageStreamResponse();
    } catch (error) {
        console.error('Error in chat API:', error);
        return new Response(
            error instanceof Error ? error.message : 'Internal server error',
            { status: 500 }
        );
    }
}
