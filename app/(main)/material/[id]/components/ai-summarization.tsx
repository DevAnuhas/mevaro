"use client"

import { useMemo } from "react";
import { useCompletion } from "@ai-sdk/react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MarkdownRenderer } from "@/components/ui/markdown-renderer";
import { Sparkles, AlertCircle, Clock, FileText } from "lucide-react";
import { estimateReadingTime } from "@/lib/ai-utils";

export function AISummarization({ materialId }: { materialId: string }) {
	const { completion, error, isLoading, complete } = useCompletion({
		api: "/api/ai/summarize",
		body: { materialId },
	});

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
			{isLoading && !completion && (
				<>
					<div className="space-y-3">
						<div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
							<Sparkles className="h-4 w-4 animate-pulse" />
							<span>Analyzing material and generating summary...</span>
						</div>
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-full" />
						<Skeleton className="h-4 w-3/4" />
					</div>
				</>
			)}
			{!isLoading && !completion && (
				<div className="space-y-3">
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
					{stats && (
						<div className="flex items-center gap-4 text-sm text-muted-foreground border-b pb-3">
							{isLoading ? (
								<>
									<Sparkles className="h-4 w-4 -mr-2 animate-pulse" />
									<span>Analyzing material and generating summary...</span>
								</>
							) : (
								<>
									<div className="flex items-center gap-1.5">
										<FileText className="h-4 w-4" />
										<span>{stats.wordCount} words</span>
									</div>
									<div className="flex items-center gap-1.5">
										<Clock className="h-4 w-4" />
										<span>{stats.readingTime} min read</span>
									</div>
								</>
							)}
						</div>
					)}

					<MarkdownRenderer content={completion} />

					<Button
						variant="outline"
						onClick={handleGenerateSummary}
						className="w-full gap-2 bg-transparent"
						disabled={isLoading}
					>
						<Sparkles className="h-4 w-4" />
						Regenerate
					</Button>
				</div>
			)}
		</div>
	);
};

