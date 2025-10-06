"use client";

import { useState } from "react";
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
import { Search, Trash2, FileText, ImageIcon, Eye } from "lucide-react";

// Mock approved materials (ORM-ready: Material table with status='approved')
const mockMaterials = [
	{
		id: "1",
		title: "Introduction to Machine Learning",
		category: "Technology",
		fileType: "pdf",
		uploaderId: "user-1",
		uploaderName: "Dr. Sarah Chen",
		downloadCount: 234,
		viewCount: 567,
		createdAt: "2023-12-10T10:30:00Z",
	},
	{
		id: "2",
		title: "Organic Chemistry Fundamentals",
		category: "Science",
		fileType: "pdf",
		uploaderId: "user-2",
		uploaderName: "Prof. Michael Torres",
		downloadCount: 189,
		viewCount: 423,
		createdAt: "2023-12-15T14:20:00Z",
	},
	{
		id: "3",
		title: "Renaissance Art History",
		category: "Arts",
		fileType: "pdf",
		uploaderId: "user-3",
		uploaderName: "Emma Wilson",
		downloadCount: 156,
		viewCount: 389,
		createdAt: "2024-01-05T09:15:00Z",
	},
	{
		id: "4",
		title: "Linear Algebra Textbook",
		category: "Mathematics",
		fileType: "pdf",
		uploaderId: "user-4",
		uploaderName: "James Rodriguez",
		downloadCount: 312,
		viewCount: 678,
		createdAt: "2023-11-20T16:45:00Z",
	},
];

const categoryColors = {
	Science: "bg-green-500",
	Technology: "bg-blue-500",
	Engineering: "bg-orange-500",
	Arts: "bg-purple-500",
	Mathematics: "bg-red-500",
};

export function MaterialManagementTable() {
	const [materials, setMaterials] = useState(mockMaterials);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedMaterial, setSelectedMaterial] = useState<
		(typeof mockMaterials)[0] | null
	>(null);
	const [deleteDialog, setDeleteDialog] = useState(false);

	const handleDeleteMaterial = (materialId: string) => {
		// ORM-ready: DELETE FROM Material WHERE id=?
		setMaterials(materials.filter((m) => m.id !== materialId));
		setDeleteDialog(false);
		setSelectedMaterial(null);
	};

	const filteredMaterials = materials.filter((material) =>
		material.title.toLowerCase().includes(searchQuery.toLowerCase())
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
				{/* Search */}
				<div className="relative">
					<Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
					<Input
						placeholder="Search materials by title..."
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
							{filteredMaterials.length === 0 ? (
								<TableRow>
									<TableCell
										colSpan={7}
										className="text-center py-8 text-muted-foreground"
									>
										No materials found
									</TableCell>
								</TableRow>
							) : (
								filteredMaterials.map((material) => (
									<TableRow key={material.id}>
										<TableCell>
											<div className="flex items-center gap-3">
												{material.fileType === "pdf" ? (
													<FileText className="h-5 w-5 text-muted-foreground" />
												) : (
													<ImageIcon className="h-5 w-5 text-muted-foreground" />
												)}
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
										<TableCell className="text-sm">
											{material.uploaderName}
										</TableCell>
										<TableCell className="text-center font-medium">
											{material.downloadCount}
										</TableCell>
										<TableCell className="text-center font-medium">
											{material.viewCount}
										</TableCell>
										<TableCell className="text-sm text-muted-foreground">
											{formatDate(material.createdAt)}
										</TableCell>
										<TableCell className="text-right">
											<div className="flex justify-end gap-2">
												<Button size="sm" variant="outline">
													<Eye className="h-4 w-4" />
												</Button>
												<Button
													size="sm"
													variant="outline"
													className="text-red-600 hover:text-red-700 bg-transparent"
													onClick={() => {
														setSelectedMaterial(material);
														setDeleteDialog(true);
													}}
												>
													<Trash2 className="h-4 w-4" />
												</Button>
											</div>
										</TableCell>
									</TableRow>
								))
							)}
						</TableBody>
					</Table>
				</div>
			</div>

			{/* Delete Dialog */}
			<Dialog open={deleteDialog} onOpenChange={setDeleteDialog}>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>Delete Material</DialogTitle>
						<DialogDescription>
							Are you sure you want to delete &quot;{selectedMaterial?.title}
							&quot;? This action cannot be undone and the material will be
							permanently removed from the library.
						</DialogDescription>
					</DialogHeader>
					<DialogFooter>
						<Button variant="outline" onClick={() => setDeleteDialog(false)}>
							Cancel
						</Button>
						<Button
							variant="destructive"
							onClick={() =>
								selectedMaterial && handleDeleteMaterial(selectedMaterial.id)
							}
						>
							Delete Material
						</Button>
					</DialogFooter>
				</DialogContent>
			</Dialog>
		</>
	);
}
