"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/prisma"
import { MaterialStatus, Category } from "@prisma/client"
import { getServerSession } from "@/lib/get-session"

/**
 * List users with optional filtering, searching, sorting, and pagination
 */
export async function listUsers(params?: {
    searchValue?: string
    searchField?: "email" | "name"
    searchOperator?: "contains" | "starts_with" | "ends_with"
    limit?: number
    offset?: number
    sortBy?: string
    sortDirection?: "asc" | "desc"
    filterField?: string
    filterValue?: string | number | boolean
    filterOperator?: "eq" | "ne" | "lt" | "lte" | "gt" | "gte"
}) {
    try {
        const queryParams = params ? {
            ...params,
            limit: params.limit?.toString(),
            offset: params.offset?.toString(),
        } : {}

        const result = await auth.api.listUsers({
            query: queryParams,
            headers: await headers(),
        })

        if (!result) {
            return {
                success: false,
                error: "Failed to fetch users",
            }
        }

        return {
            success: true,
            data: result,
        }
    } catch (error) {
        console.error("Error listing users:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch users",
        }
    }
}

/**
 * Get user statistics (uploads and downloads count)
 */
export async function getUserStatistics(userIds: string[]) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        // Get upload counts (materials uploaded by each user)
        const uploadCounts = await prisma.material.groupBy({
            by: ['uploaderId'],
            where: {
                uploaderId: {
                    in: userIds,
                },
            },
            _count: {
                id: true,
            },
        })

        // Get download counts (downloads made by each user)
        const downloadCounts = await prisma.download.groupBy({
            by: ['userId'],
            where: {
                userId: {
                    in: userIds,
                },
            },
            _count: {
                id: true,
            },
        })

        // Transform to a more usable format
        const statistics: Record<string, { uploads: number; downloads: number }> = {}

        userIds.forEach(userId => {
            statistics[userId] = { uploads: 0, downloads: 0 }
        })

        uploadCounts.forEach(item => {
            statistics[item.uploaderId] = {
                ...statistics[item.uploaderId],
                uploads: item._count.id,
            }
        })

        downloadCounts.forEach(item => {
            statistics[item.userId] = {
                ...statistics[item.userId],
                downloads: item._count.id,
            }
        })

        return {
            success: true,
            data: statistics,
        }
    } catch (error) {
        console.error("Error fetching user statistics:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch user statistics",
        }
    }
}

/**
 * Ban a user
 */
export async function banUser(params: {
    userId: string
    banReason?: string
    banExpiresIn?: number
}) {
    try {
        await auth.api.banUser({
            body: {
                userId: params.userId,
                banReason: params.banReason,
                banExpiresIn: params.banExpiresIn,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "User banned successfully",
        }
    } catch (error) {
        console.error("Error banning user:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to ban user",
        }
    }
}

/**
 * Unban a user
 */
export async function unbanUser(params: { userId: string }) {
    try {
        await auth.api.unbanUser({
            body: {
                userId: params.userId,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "User unbanned successfully",
        }
    } catch (error) {
        console.error("Error unbanning user:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to unban user",
        }
    }
}

/**
 * Set user role
 */
export async function setUserRole(params: { userId: string; role: "user" | "admin" | ("user" | "admin")[] }) {
    try {
        await auth.api.setRole({
            body: {
                userId: params.userId,
                role: params.role,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "User role updated successfully",
        }
    } catch (error) {
        console.error("Error setting user role:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update user role",
        }
    }
}

/**
 * Update user details
 */
export async function updateUser(params: { userId: string; data: Record<string, unknown> }) {
    try {
        await auth.api.adminUpdateUser({
            body: {
                userId: params.userId,
                data: params.data,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "User updated successfully",
        }
    } catch (error) {
        console.error("Error updating user:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update user",
        }
    }
}

/**
 * Remove user (hard delete)
 */
export async function removeUser(params: { userId: string }) {
    try {
        await auth.api.removeUser({
            body: {
                userId: params.userId,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "User removed successfully",
        }
    } catch (error) {
        console.error("Error removing user:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to remove user",
        }
    }
}

/**
 * List all sessions for a user
 */
export async function listUserSessions(params: { userId: string }) {
    try {
        const result = await auth.api.listUserSessions({
            body: {
                userId: params.userId,
            },
            headers: await headers(),
        })

        return {
            success: true,
            data: result,
        }
    } catch (error) {
        console.error("Error listing user sessions:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch user sessions",
        }
    }
}

/**
 * Revoke a specific session
 */
export async function revokeUserSession(params: { sessionToken: string }) {
    try {
        await auth.api.revokeUserSession({
            body: {
                sessionToken: params.sessionToken,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "Session revoked successfully",
        }
    } catch (error) {
        console.error("Error revoking session:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to revoke session",
        }
    }
}

/**
 * Revoke all sessions for a user
 */
export async function revokeUserSessions(params: { userId: string }) {
    try {
        await auth.api.revokeUserSessions({
            body: {
                userId: params.userId,
            },
            headers: await headers(),
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "All sessions revoked successfully",
        }
    } catch (error) {
        console.error("Error revoking sessions:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to revoke sessions",
        }
    }
}

/**
 * Get pending materials for approval
 */
export async function getPendingMaterials() {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const materials = await prisma.material.findMany({
            where: {
                status: MaterialStatus.PENDING,
            },
            include: {
                uploader: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        })

        return {
            success: true,
            data: materials,
        }
    } catch (error) {
        console.error("Error fetching pending materials:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch pending materials",
        }
    }
}

/**
 * Approve a material
 */
export async function approveMaterial(materialId: string) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const material = await prisma.material.update({
            where: {
                id: materialId,
            },
            data: {
                status: MaterialStatus.APPROVED,
                approvedAt: new Date(),
            },
        })

        revalidatePath("/admin")
        revalidatePath("/library")

        return {
            success: true,
            message: "Material approved successfully",
            data: material,
        }
    } catch (error) {
        console.error("Error approving material:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to approve material",
        }
    }
}

/**
 * Reject a material
 */
export async function rejectMaterial(materialId: string) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const material = await prisma.material.update({
            where: {
                id: materialId,
            },
            data: {
                status: MaterialStatus.REJECTED,
            },
        })

        revalidatePath("/admin")

        return {
            success: true,
            message: "Material rejected successfully",
            data: material,
        }
    } catch (error) {
        console.error("Error rejecting material:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to reject material",
        }
    }
}

/**
 * Get all approved materials with optional filtering and pagination
 */
export async function getApprovedMaterials(params?: {
    searchQuery?: string
    category?: Category
    limit?: number
    offset?: number
}) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const where = {
            status: MaterialStatus.APPROVED,
            ...(params?.category && { category: params.category }),
            ...(params?.searchQuery && {
                OR: [
                    { title: { contains: params.searchQuery, mode: "insensitive" as const } },
                    { description: { contains: params.searchQuery, mode: "insensitive" as const } },
                ],
            }),
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
                orderBy: {
                    createdAt: "desc",
                },
                take: params?.limit || 50,
                skip: params?.offset || 0,
            }),
            prisma.material.count({ where }),
        ])

        return {
            success: true,
            data: {
                materials,
                total,
            },
        }
    } catch (error) {
        console.error("Error fetching approved materials:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch materials",
        }
    }
}

/**
 * Delete a material (soft delete by setting status to REJECTED or hard delete)
 */
export async function deleteMaterial(materialId: string, hardDelete = false) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        if (hardDelete) {
            // Hard delete - permanently remove from database
            await prisma.material.delete({
                where: {
                    id: materialId,
                },
            })
        } else {
            // Soft delete - just reject the material
            await prisma.material.update({
                where: {
                    id: materialId,
                },
                data: {
                    status: MaterialStatus.REJECTED,
                },
            })
        }

        revalidatePath("/admin")
        revalidatePath("/library")

        return {
            success: true,
            message: hardDelete ? "Material permanently deleted" : "Material removed from library",
        }
    } catch (error) {
        console.error("Error deleting material:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete material",
        }
    }
}

/**
 * Get admin dashboard statistics
 */
export async function getAdminStats() {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const now = new Date()
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)

        const [
            totalUsers,
            totalMaterials,
            totalDownloads,
            pendingApprovals,
            newUsersThisMonth,
            materialsThisMonth,
            downloadsThisMonth,
        ] = await Promise.all([
            prisma.user.count(),
            prisma.material.count({
                where: { status: MaterialStatus.APPROVED },
            }),
            prisma.download.count(),
            prisma.material.count({
                where: { status: MaterialStatus.PENDING },
            }),
            prisma.user.count({
                where: {
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            }),
            prisma.material.count({
                where: {
                    status: MaterialStatus.APPROVED,
                    createdAt: {
                        gte: startOfMonth,
                    },
                },
            }),
            prisma.download.count({
                where: {
                    downloadedAt: {
                        gte: startOfMonth,
                    },
                },
            }),
        ])

        return {
            success: true,
            data: {
                totalUsers,
                totalMaterials,
                totalDownloads,
                pendingApprovals,
                newUsersThisMonth,
                materialsThisMonth,
                downloadsThisMonth,
            },
        }
    } catch (error) {
        console.error("Error fetching admin stats:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch statistics",
        }
    }
}

/**
 * Get material by ID (for preview in admin)
 */
export async function getMaterialById(materialId: string) {
    try {
        const session = await getServerSession()

        if (!session?.user || session.user.role !== "admin") {
            return {
                success: false,
                error: "Unauthorized",
            }
        }

        const material = await prisma.material.findUnique({
            where: {
                id: materialId,
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
        })

        if (!material) {
            return {
                success: false,
                error: "Material not found",
            }
        }

        return {
            success: true,
            data: material,
        }
    } catch (error) {
        console.error("Error fetching material:", error)
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to fetch material",
        }
    }
}
