"use client";

import { useState, useEffect } from "react";
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
import { Search, Trash2, FileText, ImageIcon, Loader2 } from "lucide-react";
import { getApprovedMaterials, deleteMaterial } from "../actions";
import { toast } from "sonner";
import type { Material, User } from "@prisma/client";

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

export function MaterialManagementTable() {
	const [materials, setMaterials] = useState<MaterialWithUploader[]>([]);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMaterial, setSelectedMaterial] =
		useState<MaterialWithUploader | null>(null);
	const [deleteDialog, setDeleteDialog] = useState(false);
	const [deleteLoading, setDeleteLoading] = useState(false);

	const loadMaterials = async (search?: string) => {
		setLoading(true);
		const result = await getApprovedMaterials({
			searchQuery: search,
			limit: 100,
		});

		if (result.success && result.data) {
			setMaterials(result.data.materials);
		} else {
			toast.error("Failed to load materials");
		}
		setLoading(false);
	};

	useEffect(() => {
		loadMaterials();
	}, []);

	const handleSearch = (e: React.FormEvent) => {
		e.preventDefault();
		loadMaterials(searchQuery);
	};

	const handleDeleteMaterial = async (materialId: string) => {
		setDeleteLoading(true);
		const result = await deleteMaterial(materialId, false);

		if (result.success) {
			toast.success("Material removed from library");
			setMaterials(materials.filter((m) => m.id !== materialId));
			setDeleteDialog(false);
			setSelectedMaterial(null);
		} else {
			toast.error(result.error || "Failed to delete material");
		}
		setDeleteLoading(false);
	};

	const formatDate = (date: Date) => {
		return new Date(date).toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
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
			<div className="space-y-4">
				<form onSubmit={handleSearch} className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search materials by title..."
						value={searchQuery}
						onChange={(e) => setSearchQuery(e.target.value)}
						className="pl-9"
					/>
				</form>

				<div className="rounded-md border">
					<Table>
						<TableHeader>
							<TableRow>
								<TableHead>Material</TableHead>
								<TableHead>Category</TableHead>
								<TableHead>Uploader</TableHead>
								<TableHead className="text-center">Downloads</TableHead>
								<TableHead className="text-center">Views</TableHead>
								<TableHead>Published</TableHead>
								<TableHead className="text-right">Actions</TableHead>
							</TableRow>
						</TableHeader>
						<TableBody>
							{materials.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-center py-8 text-muted-foreground"
									>
										No materials found
									</TableCell>
								</TableRow>
							) : (
								materials.map((material) => (
									<TableRow key={material.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												<div>
													{material.fileType.includes("pdf") ? (
														<FileText className="h-5 w-5 text-muted-foreground" />
													) : (
														<ImageIcon className="h-5 w-5 text-muted-foreground" />
													)}
												</div>
												<div className="font-medium">{material.title}</div>
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
											<div className="text-sm">{material.uploader.name}</div>
										</TableCell>
										<TableCell className="text-center">
											{material.downloadCount}
										</TableCell>
										<TableCell className="text-center">
											{material.viewCount}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{material.approvedAt
												? formatDate(material.approvedAt)
												: "N/A"}
										</TableCell>
										<TableCell className="text-right">
											<Button
												size="sm"
												variant="outline"
												className="text-red-600 hover:text-red-700"
												onClick={() => {
													setSelectedMaterial(material);
													setDeleteDialog(true);
												}}
											>
												<Trash2 className="h-4 w-4" />
											</Button>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			<Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Remove Material</DialogTitle>
						<DialogDescription>
							Are you sure you want to remove &quot;{selectedMaterial?.title}
							&quot; from the library? This will set the material status to
							rejected and hide it from users.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button
							variant="outline"
							onClick={() => setDeleteDialog(false)}
							disabled={deleteLoading}
						>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								selectedMaterial && handleDeleteMaterial(selectedMaterial.id)
							}
							disabled={deleteLoading}
						>
							{deleteLoading && (
								<Loader2 className="mr-2 h-4 w-4 animate-spin" />
							)}
							Remove Material
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
