import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/embeddings";
import { MaterialStatus } from "@prisma/client";

interface SearchResult {
    id: string;
    title: string;
    description: string | null;
    fileUrl: string;
    fileType: string;
    fileSize: number;
    category: string;
    keywords: string[];
    status: string;
    uploaderId: string;
    viewCount: number;
    downloadCount: number;
    createdAt: Date;
    updatedAt: Date;
    approvedAt: Date | null;
    similarity: number;
}

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const {
            query,
            categories,
            limit = 50,
            threshold = 0.3 // Minimum similarity threshold
        } = body;

        if (!query || typeof query !== 'string') {
            return NextResponse.json(
                { error: "Query is required and must be a string" },
                { status: 400 }
            );
        }

        // Generate embedding for the search query
        const queryEmbedding = await generateEmbedding(query);

        // Convert embedding array to PostgreSQL vector format
        const embeddingString = `[${queryEmbedding.join(',')}]`;

        // Build the query with or without category filter
        let results: SearchResult[];

        if (categories && categories.length > 0) {
            // Query with category filter
            const categoryList = categories.map((c: string) => c.toUpperCase());
            results = await prisma.$queryRaw`
                SELECT 
                    id,
                    title,
                    description,
                    "fileUrl",
                    "fileType",
                    "fileSize",
                    category,
                    keywords,
                    status,
                    "uploaderId",
                    "viewCount",
                    "downloadCount",
                    "createdAt",
                    "updatedAt",
                    "approvedAt",
                    1 - (embedding <=> ${embeddingString}::vector) as similarity
                FROM material
                WHERE 
                    status = ${MaterialStatus.APPROVED}::"MaterialStatus"
                    AND embedding IS NOT NULL
                    AND category = ANY(${categoryList}::"Category"[])
                ORDER BY embedding <=> ${embeddingString}::vector
                LIMIT ${limit}
            `;
        } else {
            // Query without category filter
            results = await prisma.$queryRaw`
                SELECT 
                    id,
                    title,
                    description,
                    "fileUrl",
                    "fileType",
                    "fileSize",
                    category,
                    keywords,
                    status,
                    "uploaderId",
                    "viewCount",
                    "downloadCount",
                    "createdAt",
                    "updatedAt",
                    "approvedAt",
                    1 - (embedding <=> ${embeddingString}::vector) as similarity
                FROM material
                WHERE 
                    status = ${MaterialStatus.APPROVED}::"MaterialStatus"
                    AND embedding IS NOT NULL
                ORDER BY embedding <=> ${embeddingString}::vector
                LIMIT ${limit}
            `;
        }

        // Filter by similarity threshold
        const filteredResults = (results as SearchResult[]).filter(
            (result) => result.similarity >= threshold
        );

        // Get uploader information for each material
        const materialsWithUploaders = await Promise.all(
            filteredResults.map(async (material) => {
                const uploader = await prisma.user.findUnique({
                    where: { id: material.uploaderId },
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                });

                return {
                    ...material,
                    uploader,
                };
            })
        );

        return NextResponse.json({
            success: true,
            data: {
                materials: materialsWithUploaders,
                total: materialsWithUploaders.length,
                searchType: 'semantic',
            },
        });
    } catch (error) {
        console.error("Error in semantic search:", error);
        return NextResponse.json(
            {
                success: false,
                error: error instanceof Error ? error.message : "Failed to perform semantic search",
                searchType: 'semantic'
            },
            { status: 500 }
        );
    }
}
