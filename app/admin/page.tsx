import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, FileText, Download, Clock } from "lucide-react";
import { PendingApprovalsTable } from "./components/pending-approvals-table";
import { UserManagementTable } from "./components/user-management-table";
import { MaterialManagementTable } from "./components/material-management-table";
import { notFound } from "next/navigation";
import { getServerSession } from "@/lib/get-session";
import { getAdminStats } from "./actions";
import type { Metadata } from "next";

export const metadata: Metadata = {
	title: "Admin Dashboard",
	description:
		"Admin dashboard for managing users, materials, and platform statistics.",
	robots: {
		index: false,
		follow: false,
	},
};

export default async function AdminPage() {
	const session = await getServerSession();

	if (session?.user.role !== "admin") {
		return notFound();
	}

	const statsResult = await getAdminStats();
	const globalStats =
		statsResult.success && statsResult.data
			? statsResult.data
			: {
					totalUsers: 0,
					totalMaterials: 0,
					totalDownloads: 0,
					pendingApprovals: 0,
					newUsersThisMonth: 0,
					materialsThisMonth: 0,
					downloadsThisMonth: 0,
			  };

	return (
		<div className="container mx-auto px-6 pt-24 pb-12">
			{/* Header */}
			<div className="mb-8">
				<h1 className="text-4xl font-bold mb-2">Admin Dashboard</h1>
				<p className="text-muted-foreground">
					Manage users, approve materials, and monitor platform statistics
				</p>
			</div>

			{/* Global Statistics */}
			<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
				<Card className="border-primary">
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Pending Approvals
						</CardTitle>
						<Clock className="h-4 w-4 text-primary" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold text-primary">
							{globalStats.pendingApprovals}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							Requires attention
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">Total Users</CardTitle>
						<Users className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{globalStats.totalUsers.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span className="text-primary">
								+{globalStats.newUsersThisMonth}
							</span>{" "}
							this month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Total Materials
						</CardTitle>
						<FileText className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{globalStats.totalMaterials.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span className="text-primary">
								+{globalStats.materialsThisMonth}
							</span>{" "}
							this month
						</p>
					</CardContent>
				</Card>

				<Card>
					<CardHeader className="flex flex-row items-center justify-between pb-2">
						<CardTitle className="text-sm font-medium">
							Total Downloads
						</CardTitle>
						<Download className="h-4 w-4 text-muted-foreground" />
					</CardHeader>
					<CardContent>
						<div className="text-2xl font-bold">
							{globalStats.totalDownloads.toLocaleString()}
						</div>
						<p className="text-xs text-muted-foreground mt-1">
							<span className="text-primary">
								+{globalStats.downloadsThisMonth}
							</span>{" "}
							this month
						</p>
					</CardContent>
				</Card>
			</div>

			{/* Management Tabs */}
			<Tabs defaultValue="approvals" className="space-y-4">
				<TabsList className="w-full grid grid-cols-3">
					<TabsTrigger value="approvals" className="gap-2">
						<Clock className="h-4 w-4" />
						Pending Approvals
						{globalStats.pendingApprovals > 0 && (
							<span className="ml-1 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
								{globalStats.pendingApprovals}
							</span>
						)}
					</TabsTrigger>
					<TabsTrigger value="users" className="gap-2">
						<Users className="h-4 w-4" />
						User Management
					</TabsTrigger>
					<TabsTrigger value="materials" className="gap-2">
						<FileText className="h-4 w-4" />
						Material Management
					</TabsTrigger>
				</TabsList>

				<TabsContent value="approvals" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Pending Material Approvals</CardTitle>
							<CardDescription>
								Review and approve or reject materials submitted by users
							</CardDescription>
						</CardHeader>
						<CardContent>
							<PendingApprovalsTable />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="users" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>User Management</CardTitle>
							<CardDescription>
								View user statistics and manage user accounts
							</CardDescription>
						</CardHeader>
						<CardContent>
							<UserManagementTable />
						</CardContent>
					</Card>
				</TabsContent>

				<TabsContent value="materials" className="space-y-4">
					<Card>
						<CardHeader>
							<CardTitle>Material Management</CardTitle>
							<CardDescription>
								View all approved materials and remove policy-violating content
							</CardDescription>
						</CardHeader>
						<CardContent>
							<MaterialManagementTable />
						</CardContent>
					</Card>
				</TabsContent>
			</Tabs>
		</div>
	);
}
