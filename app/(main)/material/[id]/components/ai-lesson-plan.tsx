"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Sparkles, CheckCircle2, AlertCircle, RefreshCw } from "lucide-react";

interface LessonSection {
	title: string;
	duration: string;
	content: string[];
}

interface LessonPlanData {
	sections: LessonSection[];
	totalDuration: string;
}

interface AILessonPlanProps {
	materialId: string;
}

export function AILessonPlan({ materialId }: AILessonPlanProps) {
	const [lessonPlan, setLessonPlan] = useState<LessonPlanData | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateLessonPlan = async () => {
		setIsLoading(true);
		setError(null);

		try {
			const response = await fetch("/api/ai/lesson-plan", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ materialId }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to generate lesson plan");
			}

			const data = await response.json();
			setLessonPlan(data);
		} catch (err) {
			console.error("Error generating lesson plan:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to generate lesson plan. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div className="space-y-4">
			{error && (
				<div className="flex items-center gap-2 text-sm text-destructive">
					<AlertCircle className="h-4 w-4" />
					<span>{error}</span>
				</div>
			)}

			{isLoading && (
				<div className="space-y-3">
					<div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
						<Sparkles className="h-4 w-4 animate-pulse" />
						<span>Analyzing material and creating lesson plan...</span>
					</div>
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
					<Skeleton className="h-32 w-full" />
				</div>
			)}

			{!isLoading && !lessonPlan && (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Generate a structured lesson plan or study guide based on this
						material.
					</p>
					<Button onClick={generateLessonPlan} className="w-full gap-2">
						<Sparkles className="h-4 w-4" />
						Generate Lesson Plan
					</Button>
				</div>
			)}

			{!isLoading && lessonPlan && (
				<div className="space-y-4">
					<div className="space-y-4">
						{lessonPlan.sections.map((section, idx) => (
							<Card key={idx} className="p-4">
								<div className="space-y-3">
									<div className="flex items-start justify-between gap-4">
										<div>
											<h4 className="font-semibold">{section.title}</h4>
											<p className="text-sm text-muted-foreground">
												{section.duration}
											</p>
										</div>
										<span className="text-sm font-medium text-primary whitespace-nowrap">
											Step {idx + 1}
										</span>
									</div>
									<ul className="space-y-2">
										{section.content.map((item, itemIdx) => (
											<li
												key={itemIdx}
												className="flex items-start gap-2 text-sm"
											>
												<CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
												<span>{item}</span>
											</li>
										))}
									</ul>
								</div>
							</Card>
						))}
					</div>

					<div className="bg-muted rounded-lg p-4">
						<p className="text-sm font-medium mb-1">Total Duration</p>
						<p className="text-2xl font-bold text-primary">
							{lessonPlan.totalDuration}
						</p>
					</div>

					<Button
						variant="outline"
						onClick={generateLessonPlan}
						className="w-full gap-2 bg-transparent"
					>
						<RefreshCw className="h-4 w-4" />
						Regenerate Lesson Plan
					</Button>
				</div>
			)}
		</div>
	);
}
