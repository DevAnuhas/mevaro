"use client";

import { useEffect } from "react";
import { incrementViewCount } from "../actions";

interface ViewTrackerProps {
	materialId: string;
}

export function ViewTracker({ materialId }: ViewTrackerProps) {
	useEffect(() => {
		// Increment view count when component mounts
		incrementViewCount(materialId);
	}, [materialId]);

	return null; // This component doesn't render anything
}
