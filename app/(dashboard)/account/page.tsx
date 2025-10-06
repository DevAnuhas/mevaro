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

// Mock data - will be replaced with actual data from DB
const mockUserStats = {
	uploadCount: 24,
	downloadCount: 156,
	joinedDate: "2024-01-15",
	lastActive: "2024-03-10",
	totalViews: 3420,
	favoriteCategory: "Technology",
};

const mockRecentActivity = [
	{
		id: 1,
		type: "upload",
		title: "Introduction to Quantum Computing",
		category: "Science",
		date: "2024-03-10",
	},
	{
		id: 2,
		type: "download",
		title: "Advanced React Patterns",
		category: "Technology",
		date: "2024-03-09",
	},
	{
		id: 3,
		type: "download",
		title: "Linear Algebra Fundamentals",
		category: "Mathematics",
		date: "2024-03-08",
	},
	{
		id: 4,
		type: "upload",
		title: "Digital Art Composition Guide",
		category: "Arts",
		date: "2024-03-07",
	},
	{
		id: 5,
		type: "download",
		title: "Structural Engineering Basics",
		category: "Engineering",
		date: "2024-03-06",
	},
];

export default function AccountDashboard() {
	const { data: session } = useSession();

	if (!session?.user) {
		return (
			<div className="min-h-screen bg-background flex items-center justify-center">
				<Spinner className="size-8" />
			</div>
		);
	}

	const user = session.user;

	// Pie chart data
	const chartData = [
		{
			name: "Uploads",
			value: mockUserStats.uploadCount,
			color: "hsl(var(--primary))",
		},
		{
			name: "Downloads",
			value: mockUserStats.downloadCount,
			color: "hsl(var(--chart-2))",
		},
	];

	const contributionRatio = (
		(mockUserStats.uploadCount /
			(mockUserStats.uploadCount + mockUserStats.downloadCount)) *
		100
	).toFixed(1);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 pt-24 pb-12">
				{/* Header */}
				<div className="mb-8">
					<h1 className="text-4xl font-bold mb-2">My Account</h1>
					<p className="text-muted-foreground">
						Manage your profile and track your learning journey
					</p>
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
									{/* <Badge
										variant={user.role === "admin" ? "default" : "secondary"}
									>
										{user.role === "admin" ? "Admin" : "Member"}
									</Badge> */}
								</div>
								<p className="text-muted-foreground mb-4">{user.email}</p>

								<div className="flex flex-wrap gap-4 text-sm">
									<div className="flex items-center gap-2">
										<Calendar className="h-4 w-4 text-muted-foreground" />
										<span>
											Joined{" "}
											{new Date(mockUserStats.joinedDate).toLocaleDateString(
												"en-US",
												{
													month: "long",
													year: "numeric",
												}
											)}
										</span>
									</div>
									<div className="flex items-center gap-2">
										<TrendingUp className="h-4 w-4 text-muted-foreground" />
										<span>Favorite: {mockUserStats.favoriteCategory}</span>
									</div>
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Stats Grid */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">
								Total Uploads
							</CardTitle>
							<Upload className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">
								{mockUserStats.uploadCount}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Materials contributed
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
							<div className="text-3xl font-bold">
								{mockUserStats.downloadCount}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								Materials accessed
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader className="flex flex-row items-center justify-between pb-2">
							<CardTitle className="text-sm font-medium">Total Views</CardTitle>
							<FileText className="h-4 w-4 text-muted-foreground" />
						</CardHeader>
						<CardContent>
							<div className="text-3xl font-bold">
								{mockUserStats.totalViews.toLocaleString()}
							</div>
							<p className="text-xs text-muted-foreground mt-1">
								On your materials
							</p>
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
								{mockRecentActivity.map((activity, index) => (
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
										{index < mockRecentActivity.length - 1 && (
											<Separator className="mt-4" />
										)}
									</div>
								))}
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
