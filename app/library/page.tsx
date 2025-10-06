"use client";

import { useState, useEffect } from "react";
import LibraryFilters from "./components/library-filters";
import MaterialCards from "./components/material-cards";
import MaterialCardsSkeleton from "./components/material-cards-skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Upload } from "lucide-react";
import { getMaterials } from "./actions";
import { useDebounce } from "@/lib/hooks/use-debounce";
import type { Material, User } from "@prisma/client";
import { toast } from "sonner";

type MaterialWithUploader = Material & {
	uploader: Pick<User, "id" | "name" | "email">;
};

export default function LibraryPage() {
	const [materials, setMaterials] = useState<MaterialWithUploader[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);
	const [searchQuery, setSearchQuery] = useState("");
	const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
	const [sortBy, setSortBy] = useState("recent");
	const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

	const debouncedSearch = useDebounce(searchQuery, 300);

	useEffect(() => {
		const loadMaterials = async () => {
			setLoading(true);
			try {
				const result = await getMaterials({
					searchQuery: debouncedSearch,
					categories:
						selectedCategories.length > 0 ? selectedCategories : undefined,
					sortBy: sortBy as "recent" | "popular" | "views",
				});

				if (result.success && result.data) {
					setMaterials(result.data.materials);
					setTotalCount(result.data.total);
				} else {
					toast.error(result.error || "Failed to load materials");
				}
			} catch (error) {
				console.error("Failed to load materials:", error);
				toast.error("Failed to load materials. Please try again.");
			} finally {
				setLoading(false);
			}
		};

		loadMaterials();
	}, [debouncedSearch, selectedCategories, sortBy]);

	return (
		<div className="min-h-screen bg-background">
			<div className="container mx-auto px-6 pt-24 pb-12">
				{/* Header */}
				<div className="flex justify-between items-center mb-8">
					<div>
						<h1 className="mb-2 text-4xl font-bold">Library</h1>
						<p className="text-muted-foreground">
							{loading
								? "Loading materials..."
								: `Explore ${totalCount} high-quality learning materials across STEAM disciplines`}
						</p>
					</div>
					<Button asChild>
						<Link href="/upload">
							Contribute to the Library
							<Upload className="ml-2 h-4 w-4" />
						</Link>
					</Button>
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
					{loading ? (
						<MaterialCardsSkeleton viewMode={viewMode} count={6} />
					) : (
						<MaterialCards materials={materials} viewMode={viewMode} />
					)}
				</div>
			</div>
		</div>
	);
}
