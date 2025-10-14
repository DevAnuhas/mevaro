"use client";

import { useState, useEffect } from "react";
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
import { Check, X, Eye, FileText, ImageIcon, Loader2 } from "lucide-react";
import {
	getPendingMaterials,
	approveMaterial,
	rejectMaterial,
} from "../actions";
import { toast } from "sonner";
import type { Material, User } from "@prisma/client";
import { MaterialViewer } from "@/app/(main)/material/[id]/components/material-viewer";

type MaterialWithUploader = Material & {
	uploader: Pick<User, "id" | "name" | "email">;
};

const categoryColors = {
	SCIENCE: "bg-green-500",
	TECHNOLOGY: "bg-blue-500",
	ENGINEERING: "bg-orange-500",
	ARTS: "bg-purple-500",
	MATHEMATICS: "bg-red-500",
};

export function PendingApprovalsTable() {
	const [materials, setMaterials] = useState<MaterialWithUploader[]>([]);
	const [loading, setLoading] = useState(true);
	const [selectedMaterial, setSelectedMaterial] =
		useState<MaterialWithUploader | null>(null);
	const [actionDialog, setActionDialog] = useState<"approve" | "reject" | null>(
		null
	);
	const [actionLoading, setActionLoading] = useState(false);

	const loadMaterials = async () => {
		setLoading(true);
		const result = await getPendingMaterials();
		if (result.success && result.data) {
			setMaterials(result.data);
		} else {
			toast.error("Failed to load pending materials");
		}
		setLoading(false);
	};

	useEffect(() => {
		loadMaterials();
	}, []);

	const handleApprove = async (id: string) => {
		setActionLoading(true);
		const result = await approveMaterial(id);

		if (result.success) {
			toast.success("Material approved successfully");
			setMaterials(materials.filter((m) => m.id !== id));
			setActionDialog(null);
			setSelectedMaterial(null);
		} else {
			toast.error(result.error || "Failed to approve material");
		}
		setActionLoading(false);
	};

	const handleReject = async (id: string) => {
		setActionLoading(true);
		const result = await rejectMaterial(id);

		if (result.success) {
			toast.success("Material rejected");
			setMaterials(materials.filter((m) => m.id !== id));
			setActionDialog(null);
			setSelectedMaterial(null);
		} else {
			toast.error(result.error || "Failed to reject material");
		}
		setActionLoading(false);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		});
	};

	if (loading) {
		return (
			<div className="flex items-center justify-center py-8">
				<Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
			</div>
		);
	}

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
												{material.fileType.includes("pdf") ? (
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
													{material.keywords.map((keyword) => (
														<Badge
															key={keyword}
															variant="secondary"
															className="text-xs"
														>
															{keyword}
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
											<div className="font-medium">
												{material.uploader.name}
											</div>
											<div className="text-sm text-muted-foreground">
												{material.uploader.email}
											</div>
										</div>
									</TableCell>
									<TableCell className="text-sm text-muted-foreground whitespace-nowrap">
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
						<Button
							variant="outline"
							onClick={() => setActionDialog(null)}
							disabled={actionLoading}
						>
							Cancel
						</Button>
						<Button
							onClick={() =>
								selectedMaterial && handleApprove(selectedMaterial.id)
							}
							disabled={actionLoading}
						>
							{actionLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
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
						<Button
							variant="outline"
							onClick={() => setActionDialog(null)}
							disabled={actionLoading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								selectedMaterial && handleReject(selectedMaterial.id)
							}
							disabled={actionLoading}
						>
							{actionLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Reject Material
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{/* View Material Dialog */}
			<Dialog
				open={selectedMaterial !== null && actionDialog === null}
				onOpenChange={(open) => !open && setSelectedMaterial(null)}
			>
				<DialogContent className="max-h-[90vh] overflow-y-auto max-w-5xl">
					<DialogHeader>
						<DialogTitle>{selectedMaterial?.title}</DialogTitle>
						<DialogDescription>
							{selectedMaterial?.description}
						</DialogDescription>
					</DialogHeader>
					<div className="space-y-4">
						{/* Material Details */}
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<span className="font-medium">Category:</span>{" "}
								<Badge
									className={
										categoryColors[
											selectedMaterial?.category as keyof typeof categoryColors
										]
									}
								>
									{selectedMaterial?.category}
								</Badge>
							</div>
							<div>
								<span className="font-medium">Uploader:</span>{" "}
								{selectedMaterial?.uploader.name}
							</div>
							<div>
								<span className="font-medium">Keywords:</span>
								<div className="flex flex-wrap gap-1 mt-1">
									{selectedMaterial?.keywords.map((keyword) => (
										<Badge
											key={keyword}
											variant="secondary"
											className="text-xs"
										>
											{keyword}
										</Badge>
									))}
								</div>
							</div>
							<div>
								<span className="font-medium">Submitted:</span>{" "}
								{selectedMaterial && formatDate(selectedMaterial.createdAt)}
							</div>
						</div>

						{/* Material Viewer */}
						{selectedMaterial && (
							<MaterialViewer
								fileUrl={selectedMaterial.fileUrl}
								fileType={selectedMaterial.fileType}
								title={selectedMaterial.title}
							/>
						)}
					</div>
					<DialogFooter className="gap-2 mt-6">
						<Button variant="outline" onClick={() => setSelectedMaterial(null)}>
							Close
						</Button>
						<Button
							variant="outline"
							className="text-red-600 hover:text-red-700"
							onClick={() => {
								setActionDialog("reject");
							}}
						>
							<X className="h-4 w-4 mr-2" />
							Reject
						</Button>
						<Button
							className="bg-green-600 hover:bg-green-700"
							onClick={() => {
								setActionDialog("approve");
							}}
						>
							<Check className="h-4 w-4 mr-2" />
							Approve
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
