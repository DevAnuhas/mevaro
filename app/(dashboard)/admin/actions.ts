"use server"

import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"

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
