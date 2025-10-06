"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Sparkles, Filter, Grid3x3, List } from "lucide-react";
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

const STEAM_CATEGORIES = [
	{ id: "science", name: "Science", color: "oklch(0.55 0.20 150)" },
	{ id: "technology", name: "Technology", color: "oklch(0.60 0.18 220)" },
	{ id: "engineering", name: "Engineering", color: "oklch(0.65 0.15 30)" },
	{ id: "arts", name: "Arts", color: "oklch(0.50 0.22 280)" },
	{ id: "mathematics", name: "Mathematics", color: "oklch(0.70 0.18 60)" },
];

interface LibraryFiltersProps {
	searchQuery: string;
	onSearchChange: (query: string) => void;
	selectedCategories: string[];
	onCategoriesChange: (categories: string[]) => void;
	sortBy: string;
	onSortChange: (sort: string) => void;
	viewMode: "grid" | "list";
	onViewModeChange: (mode: "grid" | "list") => void;
}

export default function LibraryFilters({
	searchQuery,
	onSearchChange,
	selectedCategories,
	onCategoriesChange,
	sortBy,
	onSortChange,
	viewMode,
	onViewModeChange,
}: LibraryFiltersProps) {
	const toggleCategory = (categoryId: string) => {
		const newCategories = selectedCategories.includes(categoryId)
			? selectedCategories.filter((id) => id !== categoryId)
			: [...selectedCategories, categoryId];
		onCategoriesChange(newCategories);
	};

	const clearFilters = () => {
		onSearchChange("");
		onCategoriesChange([]);
	};

	return (
		<div className="space-y-6">
			{/* Search Bar with AI indicator */}
			<div className="relative">
				<Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
				<Input
					type="text"
					placeholder="Search materials with AI-powered search..."
					value={searchQuery}
					onChange={(e) => onSearchChange(e.target.value)}
					className="h-14 pl-12 pr-16 text-base"
				/>
				<div className="absolute right-4 top-1/2 flex -translate-y-1/2 items-center gap-2 p-2 text-xs text-primary-foreground">
					<Sparkles className="h-5 w-5 animate-pulse" />
				</div>
			</div>

			{/* Controls Bar */}
			<div className="flex flex-wrap items-center justify-between gap-4">
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
										<div key={category.id} className="flex items-center gap-3">
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
								onValueChange={onSortChange}
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
							onClick={clearFilters}
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
						onClick={() => onViewModeChange("grid")}
					>
						<Grid3x3 className="h-4 w-4" />
					</Button>
					<Button
						variant={viewMode === "list" ? "default" : "outline"}
						size="sm"
						onClick={() => onViewModeChange("list")}
					>
						<List className="h-4 w-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
