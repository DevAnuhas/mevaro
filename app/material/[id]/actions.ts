"use server";

import { prisma } from "@/lib/prisma";
import { MaterialStatus } from "@prisma/client";

export async function getMaterialById(id: string) {
    try {
        const material = await prisma.material.findUnique({
            where: {
                id,
                status: MaterialStatus.APPROVED, // Only show approved materials
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        image: true,
                    },
                },
            },
        });

        if (!material) {
            return {
                success: false,
                error: "Material not found or not approved",
            };
        }

        return {
            success: true,
            data: material,
        };
    } catch (error) {
        console.error("Failed to fetch material:", error);
        return {
            success: false,
            error: "Failed to fetch material",
        };
    }
}

export async function incrementViewCount(id: string, fingerprint?: string, userId?: string) {
    try {
        // Check if this view already exists (to prevent duplicate counting)
        const existingView = await prisma.view.findFirst({
            where: {
                materialId: id,
                OR: [
                    userId ? { userId } : {},
                    fingerprint ? { fingerprint } : {},
                ].filter(condition => Object.keys(condition).length > 0),
            },
        });

        // If view already exists, don't increment
        if (existingView) {
            return { success: true, alreadyViewed: true };
        }

        // Create new view record
        await prisma.view.create({
            data: {
                materialId: id,
                ...(userId && { userId }),
                ...(fingerprint && { fingerprint }),
            },
        });

        // Increment the view count on the material
        await prisma.material.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return { success: true, alreadyViewed: false };
    } catch (error) {
        console.error("Failed to increment view count:", error);
        return {
            success: false,
            error: "Failed to increment view count",
        };
    }
}

export async function incrementDownloadCount(id: string, userId: string) {
    try {
        // Create download record
        await prisma.download.create({
            data: {
                materialId: id,
                userId: userId,
            },
        });

        // Increment the download count on the material
        await prisma.material.update({
            where: { id },
            data: {
                downloadCount: {
                    increment: 1,
                },
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to increment download count:", error);
        return {
            success: false,
            error: "Failed to increment download count",
        };
    }
}
