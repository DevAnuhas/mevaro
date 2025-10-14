"use client"

import { useMemo, useEffect } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import {
	Sparkles,
	AlertCircle,
	Clock,
	FileText,
	RefreshCw,
} from "lucide-react";
import { estimateReadingTime } from "@/lib/ai-utils";
import { useAIToolStorage } from "@/lib/hooks/use-local-storage";

export function AISummarization({ materialId }: { materialId: string }) {
	// Cache summary in localStorage
	const [cachedSummary, setCachedSummary] = useAIToolStorage<string>(
		"summary",
		materialId,
		""
	);

	const { completion, error, isLoading, complete, setCompletion } =
		useCompletion({
			api: "/api/ai/summarize",
			body: { materialId },
		});

	// Restore cached summary on mount
	useEffect(() => {
		if (cachedSummary && !completion) {
			setCompletion(cachedSummary);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// Update cache whenever completion changes
	useEffect(() => {
		if (completion && !isLoading) {
			setCachedSummary(completion);
		}
	}, [completion, isLoading, setCachedSummary]);

	const handleGenerateSummary = async () => {
		console.log("Starting summary generation for material:", materialId);
		await complete("");
	};

	// Calculate stats
	const stats = useMemo(() => {
		if (!completion && isLoading) return null;

		const wordCount = completion.trim().split(/\s+/).length;
		const readingTime = estimateReadingTime(completion);

		return { wordCount, readingTime };
	}, [completion, isLoading]);

	return (
		<div className="space-y-4">
			{error && (
				<div className="flex items-center gap-2 text-sm text-destructive">
					<AlertCircle className="h-4 w-4" />
					<span>Failed to generate summary. Please try again.</span>
				</div>
			)}

			{isLoading && (
				<div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
					<Sparkles className="h-4 w-4 animate-pulse" />
					<span>Analyzing material and generating summary...</span>
				</div>
			)}

			{isLoading && !completion && (
				<div className="space-y-4">
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-full" />
					<Skeleton className="h-4 w-3/4" />
				</div>
			)}

			{!isLoading && !completion && (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Generate a concise summary of this material using AI.
					</p>
					<Button
						onClick={handleGenerateSummary}
						disabled={isLoading}
						className="w-full gap-2"
					>
						<Sparkles className="h-4 w-4 mr-1" />
						Generate Summary
					</Button>
				</div>
			)}

			{completion && (
				<div className="space-y-4">
					{!isLoading && stats && (
						<div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-3">
							<div className="flex items-center gap-1.5">
								<FileText className="h-4 w-4" />
								<span>{stats.wordCount} words</span>
							</div>
							<div className="flex items-center gap-1.5">
								<Clock className="h-4 w-4" />
								<span>{stats.readingTime} min read</span>
							</div>
						</div>
					)}

					<MarkdownRenderer content={completion} />
					{!isLoading && (
						<Button
							variant="outline"
							onClick={handleGenerateSummary}
							className="w-full gap-2 bg-transparent"
							disabled={isLoading}
						>
							<RefreshCw className="mr-1 h-4 w-4" />
							Regenerate
						</Button>
					)}
				</div>
			)}
		</div>
	);
};

