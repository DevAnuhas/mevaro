"use client";

import { useState, useEffect, useRef } from "react";
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
import { useSearchParams, useRouter, usePathname } from "next/navigation";

type MaterialWithUploader = Material & {
	uploader: Pick<User, "id" | "name" | "email">;
};

export default function LibraryPage() {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();
	const searchInputRef = useRef<HTMLInputElement>(null);
	const [materials, setMaterials] = useState<MaterialWithUploader[]>([]);
	const [totalCount, setTotalCount] = useState(0);
	const [loading, setLoading] = useState(true);

	// Initialize state from URL search params
	const [searchQuery, setSearchQuery] = useState(searchParams.get("q") || "");
	const [viewMode, setViewMode] = useState<"grid" | "list">(
		(searchParams.get("view") as "grid" | "list") || "grid"
	);
	const [sortBy, setSortBy] = useState(searchParams.get("sort") || "recent");
	const [selectedCategories, setSelectedCategories] = useState<string[]>(
		searchParams.get("categories")?.split(",").filter(Boolean) || []
	);

	const debouncedSearch = useDebounce(searchQuery, 300);

	// Update URL search params when filters change
	useEffect(() => {
		const params = new URLSearchParams();

		if (searchQuery) {
			params.set("q", searchQuery);
		}

		if (selectedCategories.length > 0) {
			params.set("categories", selectedCategories.join(","));
		}

		if (sortBy !== "recent") {
			params.set("sort", sortBy);
		}

		if (viewMode !== "grid") {
			params.set("view", viewMode);
		}

		const newUrl = params.toString()
			? `${pathname}?${params.toString()}`
			: pathname;

		router.push(newUrl, { scroll: false });
	}, [searchQuery, selectedCategories, sortBy, viewMode, pathname, router]);

	// Handle auto-focus when navigating from search button
	useEffect(() => {
		if (searchParams.get("focus") === "search" && searchInputRef.current) {
			// Small delay to ensure the page is fully rendered
			setTimeout(() => {
				searchInputRef.current?.focus();
			}, 100);
		}
	}, [searchParams]);

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
					searchInputRef={searchInputRef}
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
