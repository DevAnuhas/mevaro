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

export async function incrementViewCount(id: string) {
    try {
        await prisma.material.update({
            where: { id },
            data: {
                viewCount: {
                    increment: 1,
                },
            },
        });

        return { success: true };
    } catch (error) {
        console.error("Failed to increment view count:", error);
        return {
            success: false,
            error: "Failed to increment view count",
        };
    }
}

export async function incrementDownloadCount(id: string) {
    try {
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
