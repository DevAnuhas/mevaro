/**
 * Script to generate embeddings for existing approved materials
 * Run with: npx tsx scripts/generate-embeddings.ts
 */

import { prisma } from "../lib/prisma";
import { generateMaterialEmbedding } from "../lib/embeddings";
import { MaterialStatus } from "@prisma/client";

async function main() {
    console.log("Starting embedding generation for existing materials...\n");

    // Get all approved materials without embeddings
    const materials = await prisma.$queryRaw<Array<{
        id: string;
        title: string;
        description: string | null;
        keywords: string[];
    }>>`
        SELECT id, title, description, keywords
        FROM material
        WHERE status = ${MaterialStatus.APPROVED}::text::"MaterialStatus"
        AND embedding IS NULL
    `;

    console.log(`Found ${materials.length} materials without embeddings.\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const material of materials) {
        try {
            console.log(`Processing: ${material.title}...`);

            // Generate embedding
            const embedding = await generateMaterialEmbedding(
                material.title,
                material.description,
                material.keywords
            );

            // Update material with embedding using raw SQL
            const embeddingString = `[${embedding.join(',')}]`;
            await prisma.$executeRaw`
                UPDATE material
                SET embedding = ${embeddingString}::vector
                WHERE id = ${material.id}
            `;

            successCount++;
            console.log(`✓ Successfully generated embedding for: ${material.title}`);
        } catch (error) {
            errorCount++;
            console.error(`✗ Error processing "${material.title}":`, error);
        }
    }

    console.log("\n" + "=".repeat(50));
    console.log(`Embedding generation complete!`);
    console.log(`Success: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log("=".repeat(50));
}

main()
    .catch((error) => {
        console.error("Fatal error:", error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
