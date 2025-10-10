/**
 * Utility functions for AI SDK integration
 */

/**
 * Format streaming text for better readability
 */
export function formatStreamingText(text: string): string {
    return text
        .trim()
        .replace(/\n{3,}/g, '\n\n') // Replace multiple newlines with double newlines
        .replace(/\s{2,}/g, ' ') // Replace multiple spaces with single space
}

/**
 * Check if text contains markdown formatting
 */
export function hasMarkdown(text: string): boolean {
    const markdownPatterns = [
        /\*\*.*?\*\*/, // Bold
        /\*.*?\*/, // Italic
        /#+ /, // Headers
        /\[.*?\]\(.*?\)/, // Links
        /^- /, // Unordered lists
        /^\d+\. /, // Ordered lists
        /`.*?`/, // Inline code
    ]

    return markdownPatterns.some(pattern => pattern.test(text))
}

/**
 * Extract bullet points from text
 */
export function extractBulletPoints(text: string): string[] {
    const lines = text.split('\n')
    const bulletPoints: string[] = []

    for (const line of lines) {
        const trimmed = line.trim()
        if (trimmed.startsWith('•') || trimmed.startsWith('-') || /^\d+\./.test(trimmed)) {
            bulletPoints.push(trimmed.replace(/^[•\-]/, '').replace(/^\d+\./, '').trim())
        }
    }

    return bulletPoints
}

/**
 * Calculate estimated reading time (words per minute)
 */
export function estimateReadingTime(text: string, wordsPerMinute: number = 200): number {
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
}
