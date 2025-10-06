"use client"

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Search, Ban, Shield, Loader2, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { listUsers, banUser, unbanUser } from "../actions";
import { User as UserType } from "@/lib/auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function UserManagementTable() {
	const [users, setUsers] = useState<UserType[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
	const [banDialog, setBanDialog] = useState(false);
	const [banReason, setBanReason] = useState("");
	const [actionLoading, setActionLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Fetch users on mount and when search changes
	const fetchUsers = useCallback(async () => {
		setLoading(true);
		setError(null);
		const result = await listUsers({
			limit: 100,
			sortBy: "createdAt",
			sortDirection: "desc",
		});

		if (result.success && result.data) {
			setUsers(result.data.users as UserType[]);
		} else {
			const errorMessage = result.error || "Failed to fetch users";
			setError(errorMessage);
			toast.error("Failed to load users", {
				description: errorMessage,
			});
		}
		setLoading(false);
	}, []);

	useEffect(() => {
		fetchUsers();
	}, [fetchUsers]);

	const handleBanUser = async () => {
		if (!selectedUser) return;

		setActionLoading(true);
		const result = await banUser({
			userId: selectedUser.id,
			banReason: banReason || "Banned by administrator",
		});

		if (result.success) {
			toast.success("User banned successfully", {
				description: `${selectedUser.name} has been banned from the platform.`,
			});
			await fetchUsers();
			setBanDialog(false);
			setSelectedUser(null);
			setBanReason("");
		} else {
			toast.error("Failed to ban user", {
				description:
					result.error || "An error occurred while banning the user.",
			});
			setError(result.error || "Failed to ban user");
		}
		setActionLoading(false);
	};

	const handleUnbanUser = async (userId: string) => {
		setActionLoading(true);
		const result = await unbanUser({ userId });

		if (result.success) {
			toast.success("User unbanned successfully", {
				description: "The user can now access the platform again.",
			});
			await fetchUsers();
		} else {
			toast.error("Failed to unban user", {
				description:
					result.error || "An error occurred while unbanning the user.",
			});
			setError(result.error || "Failed to unban user");
		}
		setActionLoading(false);
	};

	const filteredUsers = users.filter(
		(user) =>
			user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
			user.email.toLowerCase().includes(searchQuery.toLowerCase())
	);

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	return (
		<>
			<div className="space-y-4">
				{/* Error Display */}
				{error && (
					<div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
						<div className="flex items-center gap-2">
							<AlertCircle className="h-4 w-4" />
							<span>{error}</span>
						</div>
					</div>
				)}

				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search users by name or email..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</div>

				{/* Table */}
				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>User</TableHead>
								<TableHead>Role</TableHead>
								<TableHead>Joined</TableHead>
								<TableHead>Status</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{loading ? (
								<TableRow>
									<TableCell colSpan={5} className="text-center py-8">
										<Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
									</TableCell>
								</TableRow>
							) : filteredUsers.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={5}
										className="text-center py-8 text-muted-foreground"
									>
										No users found
									</TableCell>
								</TableRow>
							) : (
								filteredUsers.map((user) => (
									<TableRow key={user.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<Avatar className="h-10 w-10">
													<AvatarImage
														src={user.image || "/placeholder.svg"}
														alt={user.name}
													/>
													<AvatarFallback className="text-lg bg-primary text-primary-foreground">
														{user.name
															.split(" ")
															.map((n: string) => n[0])
															.join("")}
													</AvatarFallback>
												</Avatar>
												<div>
													<div className="font-medium">{user.name}</div>
													<div className="text-sm text-muted-foreground">
														{user.email}
													</div>
												</div>
											</div>
										</TableCell>
										<TableCell>
											{user.role === "admin" ? (
												<Badge variant="default" className="gap-1">
													<Shield className="h-3 w-3" />
													Admin
												</Badge>
											) : (
												<Badge variant="secondary">User</Badge>
											)}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{formatDate(user.createdAt.toISOString())}
										</TableCell>
										<TableCell>
											{user.banned ? (
												<div>
													<Badge variant="destructive">Banned</Badge>
													{user.banReason && (
														<div className="text-xs text-muted-foreground mt-1">
															{user.banReason}
														</div>
													)}
												</div>
											) : (
												<Badge
													variant="secondary"
													className="bg-green-500 text-white"
												>
													Active
												</Badge>
											)}
										</TableCell>
										<TableCell className="text-right">
											{!user.banned ? (
												<Button
													size="sm"
													variant="outline"
													className="text-red-600 hover:text-red-700 bg-transparent"
													disabled={actionLoading}
													onClick={() => {
														setSelectedUser(user);
														setBanDialog(true);
													}}
												>
													<Ban className="h-4 w-4 mr-1" />
													Ban
												</Button>
											) : (
												<Button
													size="sm"
													variant="outline"
													disabled={actionLoading}
													onClick={() => handleUnbanUser(user.id)}
												>
													{actionLoading ? (
														<Loader2 className="h-4 w-4 mr-1 animate-spin" />
													) : null}
													Unban
												</Button>
											)}
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Ban Dialog */}
			<Dialog open={banDialog} onOpenChange={setBanDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Ban User</DialogTitle>
						<DialogDescription>
							Are you sure you want to ban {selectedUser?.name}? This user will
							no longer be able to access the platform.
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4 py-4">
						<div className="space-y-2">
							<Label htmlFor="ban-reason">Reason for ban (optional)</Label>
							<Textarea
								id="ban-reason"
								placeholder="e.g., Spamming, inappropriate content, etc."
								value={banReason}
								onChange={(e) => setBanReason(e.target.value)}
								rows={3}
							/>
						</div>
					</div>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setBanDialog(false)}
							disabled={actionLoading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={handleBanUser}
							disabled={actionLoading}
						>
							{actionLoading ? (
								<>
									<Loader2 className="h-4 w-4 mr-2 animate-spin" />
									Banning...
								</>
							) : (
								"Ban User"
							)}
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
