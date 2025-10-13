"use server";

import { prisma } from "@/lib/prisma";
import { Category, MaterialStatus } from "@prisma/client";

interface MaterialWithUploader {
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
    uploader: {
        id: string;
        name: string;
        email: string;
    } | null;
}

/**
 * Perform semantic search using RAG pipeline
 */
async function semanticSearch(params: {
    searchQuery: string;
    categories?: string[];
    limit?: number;
}) {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/search/semantic`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: params.searchQuery,
                categories: params.categories,
                limit: params.limit || 50,
                threshold: 0.3,
            }),
            cache: 'no-store',
        });

        if (!response.ok) {
            throw new Error('Semantic search failed');
        }

        const result = await response.json();
        return result;
    } catch (error) {
        console.error('Semantic search error:', error);
        return null;
    }
}

/**
 * Fallback to traditional text search
 */
async function traditionalSearch(params: {
    searchQuery?: string;
    categories?: string[];
    sortBy?: "recent" | "popular" | "views";
    limit?: number;
    offset?: number;
}) {
    const where = {
        status: MaterialStatus.APPROVED,
        ...(params?.searchQuery && {
            OR: [
                {
                    title: {
                        contains: params.searchQuery,
                        mode: "insensitive" as const,
                    },
                },
                {
                    description: {
                        contains: params.searchQuery,
                        mode: "insensitive" as const,
                    },
                },
                {
                    keywords: {
                        hasSome: [params.searchQuery],
                    },
                },
            ],
        }),
        ...(params?.categories &&
            params.categories.length > 0 && {
            category: {
                in: params.categories.map((c) =>
                    c.toUpperCase()
                ) as Category[],
            },
        }),
    };

    // Determine sort order
    let orderBy = {};
    switch (params?.sortBy) {
        case "popular":
            orderBy = { downloadCount: "desc" as const };
            break;
        case "views":
            orderBy = { viewCount: "desc" as const };
            break;
        case "recent":
        default:
            orderBy = { createdAt: "desc" as const };
            break;
    }

    const [materials, total] = await Promise.all([
        prisma.material.findMany({
            where,
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy,
            take: params?.limit || 50,
            skip: params?.offset || 0,
        }),
        prisma.material.count({ where }),
    ]);

    return {
        materials,
        total,
        searchType: 'traditional' as const,
    };
}

export async function getMaterials(params?: {
    searchQuery?: string;
    categories?: string[];
    sortBy?: "recent" | "popular" | "views";
    limit?: number;
    offset?: number;
}) {
    try {
        // If there's a search query, try semantic search first
        if (params?.searchQuery && params.searchQuery.trim().length > 0) {
            const semanticResult = await semanticSearch({
                searchQuery: params.searchQuery,
                categories: params.categories,
                limit: params.limit,
            });

            // If semantic search succeeds, use its results
            if (semanticResult?.success && semanticResult?.data?.materials?.length > 0) {
                // Apply sorting to semantic results if needed
                let materials = semanticResult.data.materials as MaterialWithUploader[];

                if (params.sortBy === 'popular') {
                    materials = materials.sort((a, b) => b.downloadCount - a.downloadCount);
                } else if (params.sortBy === 'views') {
                    materials = materials.sort((a, b) => b.viewCount - a.viewCount);
                } else if (params.sortBy === 'recent') {
                    materials = materials.sort((a, b) =>
                        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                    );
                }
// Default is by similarity (already sorted by the API)

                return {
                    success: true,
                    data: {
                        materials,
                        total: semanticResult.data.total,
                        searchType: 'semantic',
                    },
                };
            }

            // If semantic search fails or returns no results, fall back to traditional search
            console.log('Falling back to traditional search');
        }

        // Use traditional search for non-search queries or as fallback
        const result = await traditionalSearch(params || {});

        return {
            success: true,
            data: result,
        };
    } catch (error) {
        console.error("Error fetching materials:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch materials",
        };
    }
}

export async function getMaterialsCount() {
    try {
        const count = await prisma.material.count({
            where: {
                status: MaterialStatus.APPROVED,
            },
        });

        return {
            success: true,
            data: count,
        };
    } catch (error) {
        console.error("Error fetching materials count:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch materials count",
            data: 0,
        };
    }
}
