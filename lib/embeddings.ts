import { google } from '@ai-sdk/google';
import { embed } from 'ai';

const embeddingModel = google.textEmbeddingModel('text-embedding-004');

/**
 * Generate embedding for a given text using Gemini embedding model
 * @param text - The text to generate embedding for
 * @returns The embedding vector
 */
export async function generateEmbedding(text: string): Promise<number[]> {
    try {
        const { embedding } = await embed({
            model: embeddingModel,
            value: text,
        });

        return embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw new Error('Failed to generate embedding');
    }
}

/**
 * Generate embedding for material metadata (title, description, keywords)
 * @param title - Material title
 * @param description - Material description
 * @param keywords - Material keywords
 * @returns The embedding vector
 */
export async function generateMaterialEmbedding(
    title: string,
    description: string | null,
    keywords: string[]
): Promise<number[]> {
    // Combine title, description, and keywords into a single text
    const combinedText = [
        title,
        description || '',
        keywords.join(', ')
    ].filter(Boolean).join('\n');

    return generateEmbedding(combinedText);
}

/**
 * Calculate cosine similarity between two vectors
 * @param a - First vector
 * @param b - Second vector
 * @returns Similarity score between -1 and 1
 */
export function cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
        throw new Error('Vectors must have the same length');
    }

    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
        dotProduct += a[i] * b[i];
        normA += a[i] * a[i];
        normB += b[i] * b[i];
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}
