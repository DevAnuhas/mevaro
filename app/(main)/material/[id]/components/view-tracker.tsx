"use client";

import { useEffect, useState } from "react";
import FingerprintJS from "@fingerprintjs/fingerprintjs";
import { incrementViewCount } from "../actions";

interface ViewTrackerProps {
	materialId: string;
	userId?: string;
}

export function ViewTracker({ materialId, userId }: ViewTrackerProps) {
	const [tracked, setTracked] = useState(false);

	useEffect(() => {
		// Only track once per component mount
		if (tracked) return;

		const trackView = async () => {
			try {
				// Get the visitor fingerprint
				const fp = await FingerprintJS.load();
				const result = await fp.get();
				const fingerprint = result.visitorId;

				// Increment view count with fingerprint
				await incrementViewCount(materialId, fingerprint, userId);
				setTracked(true);
			} catch (error) {
				console.error("Failed to track view:", error);
				// Fallback: track without fingerprint
				await incrementViewCount(materialId, undefined, userId);
				setTracked(true);
			}
		};

		trackView();
	}, [materialId, userId, tracked]);

	return null; // This component doesn't render anything
}
