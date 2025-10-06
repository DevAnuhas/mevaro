"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
	PieChart,
	Pie,
	Cell,
	ResponsiveContainer,
	Legend,
	Tooltip,
} from "recharts";
import { Upload, Download, FileText, Calendar, TrendingUp } from "lucide-react";
import { useSession } from "@/lib/auth-client";
import { Spinner } from "@/components/ui/spinner";
import { getUserStats, getRecentActivity } from "./actions";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function AccountDashboard() {
	const { data: session } = useSession();
	const [userStats, setUserStats] = useState<{
		uploadCount: number;
		downloadCount: number;
		joinedDate: string;
		materialViews: number;
		materialDownloads: number;
		favoriteCategory: string;
	} | null>(null);
	const [recentActivity, setRecentActivity] = useState<
		Array<{
			id: string;
			type: "upload" | "download";
			title: string;
			category: string;
			date: string;
		}>
	>([]);
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (session?.user?.id) {
			Promise.all([
				getUserStats(session.user.id),
				getRecentActivity(session.user.id),
			]).then(([statsResult, activityResult]) => {
				if (statsResult.success && statsResult.data) {
					setUserStats(statsResult.data);
				}
				if (activityResult.success && activityResult.data) {
					setRecentActivity(activityResult.data);
				}
				setLoading(false);
			});
		}
	}, [session?.user?.id]);

	if (!session?.user || loading) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Spinner className="size-8" />
			</div>
		);
	}

	const user = session.user;

	// Default values if data hasn't loaded yet
	const stats = userStats || {
		uploadCount: 0,
		downloadCount: 0,
		joinedDate: new Date().toISOString(),
		materialViews: 0,
		materialDownloads: 0,
		favoriteCategory: "None",
	};

	// Pie chart data
	const chartData = [
		{
			name: "Uploads",
			value: stats.uploadCount,
			color: "hsl(var(--primary))",
		},
		{
			name: "Downloads",
			value: stats.downloadCount,
			color: "hsl(var(--chart-2))",
		},
	];

	const contributionRatio =
		stats.uploadCount + stats.downloadCount > 0
			? (
					(stats.uploadCount / (stats.uploadCount + stats.downloadCount)) *
					100
			  ).toFixed(1)
			: "0.0";

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 pt-24 pb-12">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="text-4xl font-bold mb-2">My Account</h1>
						<p className="text-muted-foreground">
							Manage your profile and track your learning journey
						</p>
					</div>
					<Button asChild>
						<Link href="/upload">
							Contribute to the Library
							<Upload className="ml-2 h-4 w-4" />
						</Link>
					</Button>
				</div>

				{/* Profile Section */}
				<Card className="mb-8">
					<CardContent className="pt-6">
						<div className="flex flex-col md:flex-row gap-6 items-start md:items-center">
							<Avatar className="h-24 w-24">
								<AvatarImage
									src={user.image || "/placeholder.svg"}
									alt={user.name}
								/>
								<AvatarFallback className="text-2xl bg-primary text-primary-foreground">
									{user.name
										.split(" ")
										.map((n: string) => n[0])
										.join("")}
								</AvatarFallback>
							</Avatar>

							<div className="flex-1">
								<div className="flex items-center gap-3 mb-2">
									<h2 className="text-2xl font-bold">{user.name}</h2>
									{user.role === "admin" && <Badge>Admin</Badge>}
								</div>
								<p className="text-muted-foreground mb-4">{user.email}</p>

								<div className="flex flex-wrap gap-4 text-sm">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span>
											Joined{" "}
											{new Date(stats.joinedDate).toLocaleDateString("en-US", {
												month: "long",
												year: "numeric",
											})}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<TrendingUp className="h-4 w-4 text-muted-foreground" />
										<span>Favorite: {stats.favoriteCategory}</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
					{/* User Activity Card */}
					<Card>
						<CardHeader>
							<CardTitle>My Activity</CardTitle>
							<CardDescription>
								Materials you&apos;ve uploaded and downloaded
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-around gap-4">
								<div className="flex items-center gap-3">
									<div className="rounded-lg p-2 bg-primary/10">
										<Upload className="h-5 w-5 text-primary" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Uploads</p>
										<p className="text-2xl font-bold">{stats.uploadCount}</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-lg p-2 bg-muted">
										<Download className="h-5 w-5 text-muted-foreground" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Downloads</p>
										<p className="text-2xl font-bold">{stats.downloadCount}</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Material Performance Card */}
					<Card>
						<CardHeader>
							<CardTitle>Material Impact</CardTitle>
							<CardDescription>
								Engagement on your uploaded materials
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="flex items-center justify-around gap-4">
								<div className="flex items-center gap-3">
									<div className="rounded-lg p-2 bg-blue-500/10">
										<FileText className="h-5 w-5 text-blue-500" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">Total Views</p>
										<p className="text-2xl font-bold">
											{stats.materialViews.toLocaleString()}
										</p>
									</div>
								</div>
								<div className="flex items-center gap-3">
									<div className="rounded-lg p-2 bg-green-500/10">
										<Download className="h-5 w-5 text-green-500" />
									</div>
									<div>
										<p className="text-sm text-muted-foreground">
											Total Downloads
										</p>
										<p className="text-2xl font-bold">
											{stats.materialDownloads.toLocaleString()}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Contribution Analysis */}
				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
					<Card>
						<CardHeader>
							<CardTitle>Contribution vs Consumption</CardTitle>
							<CardDescription>
								Your upload and download activity breakdown
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="h-[300px]">
								<ResponsiveContainer width="100%" height="100%">
									<PieChart>
										<Pie
											data={chartData}
											cx="50%"
											cy="50%"
											labelLine={false}
											outerRadius={80}
											fill="#8884d8"
											dataKey="value"
										>
											{chartData.map((entry, index) => (
												<Cell key={`cell-${index}`} fill={entry.color} />
											))}
										</Pie>
										<Tooltip />
										<Legend />
									</PieChart>
								</ResponsiveContainer>
							</div>
							<div className="mt-4 text-center">
								<p className="text-sm text-muted-foreground">
									You contribute{" "}
									<span className="font-semibold text-primary">
										{contributionRatio}%
									</span>{" "}
									of what you consume
								</p>
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Recent Activity</CardTitle>
							<CardDescription>
								Your latest uploads and downloads
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-4">
								{recentActivity.length === 0 ? (
									<p className="text-sm text-muted-foreground text-center py-4">
										No recent activity
									</p>
								) : (
									recentActivity.map((activity, index) => (
										<div key={activity.id}>
											<div className="flex items-start gap-3">
												<div
													className={`mt-1 rounded-full p-2 ${
														activity.type === "upload"
															? "bg-primary text-primary-foreground"
															: "bg-muted"
													}`}
												>
													{activity.type === "upload" ? (
														<Upload className="h-3 w-3" />
													) : (
														<Download className="h-3 w-3" />
													)}
												</div>
												<div className="flex-1 min-w-0">
													<p className="text-sm font-medium truncate">
														{activity.title}
													</p>
													<div className="flex items-center gap-2 mt-1">
														<Badge variant="outline" className="text-xs">
															{activity.category}
														</Badge>
														<span className="text-xs text-muted-foreground">
															{new Date(activity.date).toLocaleDateString(
																"en-US",
																{ month: "short", day: "numeric" }
															)}
														</span>
													</div>
												</div>
											</div>
											{index < recentActivity.length - 1 && (
												<Separator className="mt-4" />
											)}
										</div>
									))
								)}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
