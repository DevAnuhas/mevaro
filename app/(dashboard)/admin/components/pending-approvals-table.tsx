"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
import { Check, X, Eye, FileText, ImageIcon } from "lucide-react";

// Mock pending materials (ORM-ready: Material table with status='pending')
const mockPendingMaterials = [
	{
		id: "1",
		title: "Introduction to Quantum Mechanics",
		description: "Comprehensive guide to quantum physics fundamentals",
		category: "Science",
		subcategories: ["Physics", "Quantum Theory"],
		fileType: "pdf",
		uploaderId: "user-1",
		uploaderName: "Dr. Sarah Chen",
		uploaderEmail: "sarah.chen@university.edu",
		createdAt: "2024-01-15T10:30:00Z",
	},
	{
		id: "2",
		title: "Renaissance Art Techniques",
		description: "Study of painting methods from the Renaissance period",
		category: "Arts",
		subcategories: ["Art History", "Painting"],
		fileType: "pdf",
		uploaderId: "user-2",
		uploaderName: "Prof. Michael Torres",
		uploaderEmail: "mtorres@artschool.edu",
		createdAt: "2024-01-15T09:15:00Z",
	},
	{
		id: "3",
		title: "Calculus Problem Set",
		description: "Advanced calculus exercises with solutions",
		category: "Mathematics",
		subcategories: ["Calculus", "Problem Sets"],
		fileType: "pdf",
		uploaderId: "user-3",
		uploaderName: "Emma Wilson",
		uploaderEmail: "emma.w@student.edu",
		createdAt: "2024-01-15T08:45:00Z",
	},
];

const categoryColors = {
	Science: "bg-green-500",
	Technology: "bg-blue-500",
	Engineering: "bg-orange-500",
	Arts: "bg-purple-500",
	Mathematics: "bg-red-500",
};

export function PendingApprovalsTable() {
	const [materials, setMaterials] = useState(mockPendingMaterials);
	const [selectedMaterial, setSelectedMaterial] = useState<
		(typeof mockPendingMaterials)[0] | null
	>(null);
	const [actionDialog, setActionDialog] = useState<"approve" | "reject" | null>(
		null
	);

	const handleApprove = (id: string) => {
		// ORM-ready: UPDATE Material SET status='approved' WHERE id=?
		setMaterials(materials.filter((m) => m.id !== id));
		setActionDialog(null);
		setSelectedMaterial(null);
	};

	const handleReject = (id: string) => {
		// ORM-ready: UPDATE Material SET status='rejected' WHERE id=?
		setMaterials(materials.filter((m) => m.id !== id));
		setActionDialog(null);
		setSelectedMaterial(null);
	};

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	return (
		<>
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						<TableRow>
							<TableHead>Material</TableHead>
							<TableHead>Category</TableHead>
							<TableHead>Uploader</TableHead>
							<TableHead>Submitted</TableHead>
							<TableHead className="text-right">Actions</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{materials.length === 0 ? (
							<TableRow>
								<TableCell
									colSpan={5}
									className="text-center py-8 text-muted-foreground"
								>
									No pending approvals
								</TableCell>
							</TableRow>
						) : (
							materials.map((material) => (
								<TableRow key={material.id}>
									<TableCell>
										<div className="flex items-start gap-3">
											<div className="mt-1">
												{material.fileType === "pdf" ? (
													<FileText className="h-5 w-5 text-muted-foreground" />
												) : (
													<ImageIcon className="h-5 w-5 text-muted-foreground" />
												)}
											</div>
											<div>
												<div className="font-medium">{material.title}</div>
												<div className="text-sm text-muted-foreground line-clamp-1">
													{material.description}
												</div>
												<div className="flex flex-wrap gap-1 mt-1">
													{material.subcategories.map((sub) => (
														<Badge
															key={sub}
															variant="secondary"
															className="text-xs"
														>
															{sub}
														</Badge>
													))}
												</div>
											</div>
										</div>
									</TableCell>
									<TableCell>
										<Badge
											className={
												categoryColors[
													material.category as keyof typeof categoryColors
												]
											}
										>
											{material.category}
										</Badge>
									</TableCell>
									<TableCell>
										<div>
											<div className="font-medium">{material.uploaderName}</div>
											<div className="text-sm text-muted-foreground">
												{material.uploaderEmail}
											</div>
										</div>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground">
										{formatDate(material.createdAt)}
									</TableCell>
									<TableCell className="text-right">
										<div className="flex justify-end gap-2">
											<Button
												size="sm"
												variant="outline"
												onClick={() => setSelectedMaterial(material)}
											>
												<Eye className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-green-600 hover:text-green-700 bg-transparent"
												onClick={() => {
													setSelectedMaterial(material);
													setActionDialog("approve");
												}}
											>
												<Check className="h-4 w-4" />
											</Button>
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-700 bg-transparent"
												onClick={() => {
													setSelectedMaterial(material);
													setActionDialog("reject");
												}}
											>
												<X className="h-4 w-4" />
											</Button>
										</div>
									</TableCell>
								</TableRow>
							))
						)}
					</TableBody>
				</Table>
			</div>

			{/* Approve Dialog */}
			<Dialog
				open={actionDialog === "approve"}
				onOpenChange={() => setActionDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Approve Material</DialogTitle>
						<DialogDescription>
							Are you sure you want to approve &quot;{selectedMaterial?.title}
							&quot;? This material will be published to the library and visible
							to all users.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setActionDialog(null)}>
							Cancel
						</Button>
						<Button
							onClick={() =>
								selectedMaterial && handleApprove(selectedMaterial.id)
							}
						>
							Approve Material
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* Reject Dialog */}
			<Dialog
				open={actionDialog === "reject"}
				onOpenChange={() => setActionDialog(null)}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Reject Material</DialogTitle>
						<DialogDescription>
							Are you sure you want to reject &quot;{selectedMaterial?.title}
							&quot;? The uploader will be notified and the material will not be
							published.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setActionDialog(null)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								selectedMaterial && handleReject(selectedMaterial.id)
							}
						>
							Reject Material
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
