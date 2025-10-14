"use server";

import { prisma } from "@/lib/prisma";
import { MaterialStatus } from "@prisma/client";

export async function getUserStats(userId: string) {
    try {
        const [
            uploadCount,
            downloadCount,
            user,
            materialStats,
            categoryCount,
        ] = await Promise.all([
            // Count approved materials uploaded by user
            prisma.material.count({
                where: {
                    uploaderId: userId,
                    status: MaterialStatus.APPROVED,
                },
            }),
            // Count downloads by user
            prisma.download.count({
                where: {
                    userId,
                },
            }),
            // Get user creation date
            prisma.user.findUnique({
                where: { id: userId },
                select: {
                    createdAt: true,
                },
            }),
            // Get stats for user's uploaded materials
            prisma.material.aggregate({
                where: {
                    uploaderId: userId,
                    status: MaterialStatus.APPROVED,
                },
                _sum: {
                    viewCount: true,
                    downloadCount: true,
                },
            }),
            // Get favorite category (most uploaded category)
            prisma.material.groupBy({
                by: ["category"],
                where: {
                    uploaderId: userId,
                    status: MaterialStatus.APPROVED,
                },
                _count: {
                    category: true,
                },
                orderBy: {
                    _count: {
                        category: "desc",
                    },
                },
                take: 1,
            }),
        ]);

        const favoriteCategory =
            categoryCount.length > 0
                ? categoryCount[0].category.charAt(0) +
                categoryCount[0].category.slice(1).toLowerCase()
                : "None";

        return {
            success: true,
            data: {
                // User's activity
                uploadCount,
                downloadCount,
                joinedDate:
                    user?.createdAt.toISOString() || new Date().toISOString(),
                favoriteCategory,
                // Stats for user's uploaded materials
                materialViews: materialStats._sum.viewCount || 0,
                materialDownloads: materialStats._sum.downloadCount || 0,
            },
        };
    } catch (error) {
        console.error("Error fetching user stats:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch user stats",
        };
    }
}

export async function getRecentActivity(userId: string, limit: number = 5) {
    try {
        // Get recent uploads
        const uploads = await prisma.material.findMany({
            where: {
                uploaderId: userId,
                status: MaterialStatus.APPROVED,
            },
            select: {
                id: true,
                title: true,
                category: true,
                createdAt: true,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: limit,
        });

        // Get recent downloads
        const downloads = await prisma.download.findMany({
            where: {
                userId,
            },
            select: {
                id: true,
                downloadedAt: true,
                material: {
                    select: {
                        title: true,
                        category: true,
                    },
                },
            },
            orderBy: {
                downloadedAt: "desc",
            },
            take: limit,
        });

        // Combine and format activities
        const activities = [
            ...uploads.map((upload) => ({
                id: upload.id,
                type: "upload" as const,
                title: upload.title,
                category:
                    upload.category.charAt(0) +
                    upload.category.slice(1).toLowerCase(),
                date: upload.createdAt.toISOString(),
            })),
            ...downloads.map((download) => ({
                id: download.id,
                type: "download" as const,
                title: download.material.title,
                category:
                    download.material.category.charAt(0) +
                    download.material.category.slice(1).toLowerCase(),
                date: download.downloadedAt.toISOString(),
            })),
        ];

        // Sort by date and take top items
        activities.sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );

        return {
            success: true,
            data: activities.slice(0, limit),
        };
    } catch (error) {
        console.error("Error fetching recent activity:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch recent activity",
        };
    }
}

export async function getFavoritedMaterials(userId: string) {
    try {
        const favorites = await prisma.favorite.findMany({
            where: {
                userId,
            },
            include: {
                material: {
                    include: {
                        uploader: {
                            select: {
                                name: true,
                                image: true,
                            },
                        },
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });

        return {
            success: true,
            data: favorites.map((fav) => ({
                id: fav.material.id,
                title: fav.material.title,
                description: fav.material.description,
                category: fav.material.category,
                fileType: fav.material.fileType,
                viewCount: fav.material.viewCount,
                downloadCount: fav.material.downloadCount,
                keywords: fav.material.keywords,
                createdAt: fav.material.createdAt.toISOString(),
                favoritedAt: fav.createdAt.toISOString(),
                uploader: {
                    name: fav.material.uploader.name,
                    image: fav.material.uploader.image,
                },
            })),
        };
    } catch (error) {
        console.error("Error fetching favorited materials:", error);
        return {
            success: false,
            error:
                error instanceof Error
                    ? error.message
                    : "Failed to fetch favorited materials",
        };
    }
}
