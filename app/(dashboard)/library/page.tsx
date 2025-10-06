"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
	Search,
	Sparkles,
	Filter,
	Grid3x3,
	List,
	Download,
	Eye,
	Calendar,
	User,
	FileText,
	ImageIcon,
} from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import Link from "next/link";

// Mock data
const STEAM_CATEGORIES = [
	{ id: "science", name: "Science", color: "oklch(0.55 0.20 150)" },
	{ id: "technology", name: "Technology", color: "oklch(0.60 0.18 220)" },
	{ id: "engineering", name: "Engineering", color: "oklch(0.65 0.15 30)" },
	{ id: "arts", name: "Arts", color: "oklch(0.50 0.22 280)" },
	{ id: "mathematics", name: "Mathematics", color: "oklch(0.70 0.18 60)" },
];

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

	const toggleCategory = (categoryId: string) => {
		setSelectedCategories((prev) =>
			prev.includes(categoryId)
				? prev.filter((id) => id !== categoryId)
				: [...prev, categoryId]
		);
	};

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

				{/* Search Bar with AI indicator */}
				<div className="mb-6">
					<div className="relative">
						<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
						<Input
							type="text"
							placeholder="Search materials with AI-powered search..."
							value={searchQuery}
							onChange={(e) => setSearchQuery(e.target.value)}
							className="h-14 pl-12 pr-16 text-base"
						/>
						<div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 p-2 text-xs text-primary-foreground">
							<Sparkles className="h-5 w-5 animate-pulse" />
						</div>
					</div>
				</div>

				{/* Controls Bar */}
				<div className="mb-6 flex flex-wrap items-center justify-between gap-4">
					<div className="flex items-center gap-2">
						<Popover>
							<PopoverTrigger asChild>
								<Button variant="outline" size="sm">
									<Filter className="mr-2 h-4 w-4" />
									Filters
									{selectedCategories.length > 0 && (
										<span className="ml-1 h-5 w-5 rounded-full leading-5 text-xs bg-accent text-accent-foreground">
											{selectedCategories.length}
										</span>
									)}
								</Button>
							</PopoverTrigger>
							<PopoverContent className="w-64" align="start">
								<div className="space-y-4">
									<h4 className="font-semibold">STEAM Categories</h4>
									<div className="space-y-3">
										{STEAM_CATEGORIES.map((category) => (
											<div
												key={category.id}
												className="flex items-center gap-3"
											>
												<Checkbox
													id={category.id}
													checked={selectedCategories.includes(category.id)}
													onCheckedChange={() => toggleCategory(category.id)}
												/>
												<label
													htmlFor={category.id}
													className="flex flex-1 cursor-pointer items-center gap-2 text-sm"
												>
													<div
														className="h-3 w-3 rounded-full"
														style={{ backgroundColor: category.color }}
													/>
													{category.name}
												</label>
											</div>
										))}
									</div>
								</div>
							</PopoverContent>
						</Popover>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm">
									Sort:{" "}
									{sortBy === "recent"
										? "Recent"
										: sortBy === "popular"
										? "Popular"
										: "Most Viewed"}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuLabel>Sort by</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup
									value={sortBy}
									onValueChange={setSortBy}
								>
									<DropdownMenuRadioItem value="recent">
										Most Recent
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="popular">
										Most Downloaded
									</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="views">
										Most Viewed
									</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>

						{(selectedCategories.length > 0 || searchQuery.length > 0) && (
							<Button
								variant="ghost"
								size="sm"
								onClick={() => {
									setSelectedCategories([]);
									setSearchQuery("");
								}}
								className="w-full"
							>
								Clear filters
							</Button>
						)}
					</div>

					<div className="flex items-center gap-2">
						<Button
							variant={viewMode === "grid" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("grid")}
						>
							<Grid3x3 className="h-4 w-4" />
						</Button>
						<Button
							variant={viewMode === "list" ? "default" : "outline"}
							size="sm"
							onClick={() => setViewMode("list")}
						>
							<List className="h-4 w-4" />
						</Button>
					</div>
				</div>

				{/* Materials Grid/List */}
				{sortedMaterials.length === 0 ? (
					<Card className="border-border bg-card p-12 text-center">
						<p className="text-muted-foreground">
							No materials found matching your criteria.
						</p>
					</Card>
				) : (
					<div
						className={
							viewMode === "grid"
								? "grid gap-6 lg:grid-cols-3 sm:grid-cols-2"
								: "space-y-4"
						}
					>
						{sortedMaterials.map((material) => {
							const category = STEAM_CATEGORIES.find(
								(cat) => cat.id === material.category
							);

							return viewMode === "grid" ? (
								<Link href={`/material/${material.id}`} passHref>
									<Card
										key={material.id}
										className="group cursor-pointer border-border bg-card transition-all hover:border-primary"
									>
										<div className="p-6 h-full flex flex-col">
											<div className="mb-4 flex items-start justify-between">
												<div
													className="flex h-12 w-12 items-center justify-center rounded-lg"
													style={{ backgroundColor: category?.color }}
												>
													{material.fileType === "pdf" ? (
														<FileText className="h-6 w-6 text-white" />
													) : (
														<ImageIcon className="h-6 w-6 text-white" />
													)}
												</div>
												<Badge variant="secondary" className="text-xs">
													{category?.name}
												</Badge>
											</div>

											<h3 className="mb-2 line-clamp-2 text-lg font-semibold">
												{material.title}
											</h3>
											<p className="mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
												{material.description}
											</p>

											<div className="mb-4 flex flex-wrap gap-2">
												{material.keywords.map((item) => (
													<Badge
														key={item}
														variant="outline"
														className="text-xs"
													>
														{item}
													</Badge>
												))}
											</div>

											<div className="flex items-center justify-between border-t border-border mt-auto pt-4 text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<User className="h-3 w-3" />
													<span>{material.uploaderName}</span>
												</div>
												<div className="flex items-center gap-3">
													<div className="flex items-center gap-1">
														<Download className="h-3 w-3" />
														<span>{material.downloadCount}</span>
													</div>
													<div className="flex items-center gap-1">
														<Eye className="h-3 w-3" />
														<span>{material.viewCount}</span>
													</div>
												</div>
											</div>
										</div>
									</Card>
								</Link>
							) : (
								<Card
									key={material.id}
									className="group cursor-pointer border-border bg-card transition-all hover:border-primary"
								>
									<div className="flex gap-6 p-6">
										<div
											className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg"
											style={{ backgroundColor: category?.color }}
										>
											{material.fileType === "pdf" ? (
												<FileText className="h-8 w-8 text-white" />
											) : (
												<ImageIcon className="h-8 w-8 text-white" />
											)}
										</div>

										<div className="flex-1">
											<div className="mb-2 flex items-start justify-between">
												<h3 className="text-lg font-semibold">
													{material.title}
												</h3>
												<Badge variant="secondary" className="text-xs">
													{category?.name}
												</Badge>
											</div>

											<p className="mb-3 text-sm text-muted-foreground leading-relaxed">
												{material.description}
											</p>

											<div className="mb-3 flex flex-wrap gap-2">
												{material.keywords.map((item) => (
													<Badge
														key={item}
														variant="outline"
														className="text-xs"
													>
														{item}
													</Badge>
												))}
											</div>

											<div className="flex items-center justify-between text-xs text-muted-foreground">
												<div className="flex items-center gap-1">
													<User className="h-3 w-3" />
													<span>{material.uploaderName}</span>
												</div>
												<div className="flex items-center gap-4">
													<div className="flex items-center gap-1">
														<Download className="h-3 w-3" />
														<span>{material.downloadCount} downloads</span>
													</div>
													<div className="flex items-center gap-1">
														<Eye className="h-3 w-3" />
														<span>{material.viewCount} views</span>
													</div>
													<div className="flex items-center gap-1">
														<Calendar className="h-3 w-3" />
														<span>
															{new Date(
																material.createdAt
															).toLocaleDateString()}
														</span>
													</div>
												</div>
											</div>
										</div>
									</div>
								</Card>
							);
						})}
					</div>
				)}
			</div>
		</div>
	);
}
