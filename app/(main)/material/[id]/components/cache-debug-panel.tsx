"use client";

import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	getCachedAITools,
	clearAIToolDataForMaterial,
} from "@/lib/hooks/use-local-storage";
import { Database, Trash2, RefreshCw } from "lucide-react";

interface CacheDebugPanelProps {
	materialId: string;
}

/**
 * Debug panel to visualize and manage AI tool caches
 * Only use this in development mode
 */
export function CacheDebugPanel({ materialId }: CacheDebugPanelProps) {
	const [cachedData, setCachedData] = useState<Record<string, unknown>>({});
	const [isOpen, setIsOpen] = useState(false);

	const refreshCache = () => {
		const data = getCachedAITools(materialId);
		setCachedData(data);
	};

	const clearAll = () => {
		if (confirm("Clear all AI tool caches for this material?")) {
			clearAIToolDataForMaterial(materialId);
			refreshCache();
		}
	};

	useEffect(() => {
		refreshCache();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [materialId]);

	const getCacheSize = (data: unknown): string => {
		try {
			const size = new Blob([JSON.stringify(data)]).size;
			if (size < 1024) return `${size} B`;
			if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
			return `${(size / (1024 * 1024)).toFixed(1)} MB`;
		} catch {
			return "N/A";
		}
	};

	if (process.env.NODE_ENV === "production") {
		return null; // Don't show in production
	}

	return (
		<div className="fixed bottom-4 right-4 z-50">
			{!isOpen ? (
				<Button
					onClick={() => setIsOpen(true)}
					variant="outline"
					size="sm"
					className="gap-2 shadow-lg"
				>
					<Database className="h-4 w-4" />
					Cache Debug
				</Button>
			) : (
				<Card className="w-96 max-h-96 overflow-auto p-4 shadow-xl">
					<div className="flex items-center justify-between mb-4">
						<div className="flex items-center gap-2">
							<Database className="h-4 w-4" />
							<h3 className="font-semibold">Cache Debug Panel</h3>
						</div>
						<div className="flex gap-2">
							<Button
								variant="ghost"
								size="sm"
								onClick={refreshCache}
								className="h-8 w-8 p-0"
							>
								<RefreshCw className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={clearAll}
								className="h-8 w-8 p-0 text-destructive hover:text-destructive"
							>
								<Trash2 className="h-4 w-4" />
							</Button>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => setIsOpen(false)}
								className="h-8 w-8 p-0"
							>
								×
							</Button>
						</div>
					</div>

					<div className="space-y-2">
						<div className="text-xs text-muted-foreground mb-2">
							Material ID: <code className="text-xs">{materialId}</code>
						</div>

						{Object.keys(cachedData).length === 0 ? (
							<p className="text-sm text-muted-foreground">No cached data</p>
						) : (
							Object.entries(cachedData).map(([tool, data]) => (
								<div key={tool} className="border rounded p-2 space-y-1">
									<div className="flex items-center justify-between">
										<span className="font-medium text-sm capitalize">
											{tool.replace("-", " ")}
										</span>
										<Badge variant="secondary" className="text-xs">
											{getCacheSize(data)}
										</Badge>
									</div>
									<details className="text-xs">
										<summary className="cursor-pointer text-muted-foreground hover:text-foreground">
											View data
										</summary>
										<pre className="mt-2 p-2 bg-muted rounded text-xs overflow-auto max-h-32">
											{JSON.stringify(data, null, 2)}
										</pre>
									</details>
								</div>
							))
						)}
					</div>

					<div className="mt-4 pt-4 border-t text-xs text-muted-foreground">
						<div className="flex justify-between">
							<span>Total Items:</span>
							<span className="font-medium">
								{Object.keys(cachedData).length}
							</span>
						</div>
						<div className="flex justify-between">
							<span>Total Size:</span>
							<span className="font-medium">{getCacheSize(cachedData)}</span>
						</div>
					</div>
				</Card>
			)}
		</div>
	);
}
