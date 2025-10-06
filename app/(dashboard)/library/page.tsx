"use client";

import { useState } from "react";
import LibraryFilters from "./components/library-filters";
import MaterialCards from "./components/material-cards";

// Mock data
const MOCK_MATERIALS = [
	{
		id: "1",
		title: "Introduction to Quantum Mechanics",
		description:
			"A comprehensive guide to understanding the fundamental principles of quantum mechanics and wave-particle duality.",
		category: "science",
		keywords: ["Physics", "Quantum Theory"],
		fileType: "pdf",
		uploaderId: "user-1",
		uploaderName: "Dr. Sarah Chen",
		status: "approved",
		createdAt: "2025-01-15T10:30:00Z",
		downloadCount: 1250,
		viewCount: 3400,
	},
	{
		id: "2",
		title: "Machine Learning Fundamentals",
		description:
			"Learn the basics of machine learning algorithms, neural networks, and practical applications in modern AI.",
		category: "technology",
		keywords: ["AI", "Programming"],
		fileType: "pdf",
		uploaderId: "user-2",
		uploaderName: "Prof. James Wilson",
		status: "approved",
		createdAt: "2025-01-20T14:15:00Z",
		downloadCount: 2100,
		viewCount: 5200,
	},
	{
		id: "3",
		title: "Structural Engineering Principles",
		description:
			"Essential concepts in structural analysis, load calculations, and building design for civil engineers.",
		category: "engineering",
		keywords: ["Civil Engineering", "Structures"],
		fileType: "pdf",
		uploaderId: "user-3",
		uploaderName: "Eng. Michael Brown",
		status: "approved",
		createdAt: "2025-01-18T09:00:00Z",
		downloadCount: 890,
		viewCount: 2100,
	},
	{
		id: "4",
		title: "Color Theory in Digital Art",
		description:
			"Master the principles of color harmony, contrast, and composition in digital illustration and design.",
		category: "arts",
		keywords: ["Digital Art", "Design"],
		fileType: "png",
		uploaderId: "user-4",
		uploaderName: "Artist Emma Davis",
		status: "approved",
		createdAt: "2025-01-22T16:45:00Z",
		downloadCount: 1560,
		viewCount: 4100,
	},
	{
		id: "5",
		title: "Calculus: Limits and Derivatives",
		description:
			"Comprehensive study material covering limits, continuity, and differential calculus with solved examples.",
		category: "mathematics",
		keywords: ["Calculus", "Analysis"],
		fileType: "pdf",
		uploaderId: "user-5",
		uploaderName: "Dr. Robert Taylor",
		status: "approved",
		createdAt: "2025-01-25T11:20:00Z",
		downloadCount: 1780,
		viewCount: 4500,
	},
	{
		id: "6",
		title: "Organic Chemistry Reactions",
		description:
			"Visual guide to common organic chemistry reactions, mechanisms, and synthesis pathways.",
		category: "science",
		keywords: ["Chemistry", "Organic"],
		fileType: "png",
		uploaderId: "user-1",
		uploaderName: "Dr. Sarah Chen",
		status: "approved",
		createdAt: "2025-01-28T13:30:00Z",
		downloadCount: 920,
		viewCount: 2300,
	},
];

export default function LibraryPage() {
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState("recent");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const filteredMaterials = MOCK_MATERIALS.filter((material) => {
		const matchesSearch =
			searchQuery === "" ||
			material.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
			material.description.toLowerCase().includes(searchQuery.toLowerCase());

		const matchesCategory =
			selectedCategories.length === 0 ||
			selectedCategories.includes(material.category);

		return matchesSearch && matchesCategory;
	});

	const sortedMaterials = [...filteredMaterials].sort((a, b) => {
		switch (sortBy) {
			case "popular":
				return b.downloadCount - a.downloadCount;
			case "views":
				return b.viewCount - a.viewCount;
			case "recent":
			default:
				return (
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
				);
		}
	});

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 pt-24 pb-12">
				{/* Header */}
				<div className="mb-8">
					<h1 className="mb-2 text-4xl font-bold">Library</h1>
					<p className="text-muted-foreground">
						Explore {MOCK_MATERIALS.length} high-quality learning materials
						across STEAM disciplines
					</p>
				</div>
				<LibraryFilters
					searchQuery={searchQuery}
					onSearchChange={setSearchQuery}
					selectedCategories={selectedCategories}
					onCategoriesChange={setSelectedCategories}
					sortBy={sortBy}
					onSortChange={setSortBy}
					viewMode={viewMode}
					onViewModeChange={setViewMode}
				/>

				<div className="mt-6">
					<MaterialCards materials={sortedMaterials} viewMode={viewMode} />
				</div>
			</div>
		</div>
	);
}
