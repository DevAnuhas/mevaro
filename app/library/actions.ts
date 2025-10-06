"use server";

import { prisma } from "@/lib/prisma";
import { Category, MaterialStatus } from "@prisma/client";

export async function getMaterials(params?: {
    searchQuery?: string;
    categories?: string[];
    sortBy?: "recent" | "popular" | "views";
    limit?: number;
    offset?: number;
}) {
    try {
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
            success: true,
            data: {
                materials,
                total,
            },
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
