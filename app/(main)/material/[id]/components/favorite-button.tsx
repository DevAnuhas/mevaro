"use client";

import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";
import { toggleFavorite } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface FavoriteButtonProps {
	materialId: string;
	userId?: string;
	initialIsFavorited: boolean;
}

export function FavoriteButton({
	materialId,
	userId,
	initialIsFavorited,
}: FavoriteButtonProps) {
	const [isFavorited, setIsFavorited] = useState(initialIsFavorited);
	const [isLoading, setIsLoading] = useState(false);

	const handleToggleFavorite = async () => {
		setIsLoading(true);
		try {
			// Check if user is logged in
			if (!userId) {
				toast.error("Please login to favorite materials");
				setIsLoading(false);
				return;
			}

			// Toggle favorite
			const result = await toggleFavorite(materialId, userId);

			if (result.success && result.isFavorited !== undefined) {
				setIsFavorited(result.isFavorited);
				toast.success(
					result.isFavorited ? "Added to favorites" : "Removed from favorites"
				);
			} else {
				toast.error(result.error || "Failed to update favorite");
			}
		} catch (error) {
			console.error("Toggle favorite failed:", error);
			toast.error("Failed to update favorite");
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<Button
			variant={isFavorited ? "default" : "outline"}
			size="icon"
			onClick={handleToggleFavorite}
			disabled={isLoading}
			className="gap-2"
		>
			{isLoading ? (
				<Spinner className="h-4 w-4" />
			) : (
				<Heart className={`h-4 w-4 ${isFavorited ? "fill-current" : ""}`} />
			)}
		</Button>
	);
}
