"use client"

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import {
	Sparkles,
	CheckCircle2,
	XCircle,
	AlertCircle,
	RefreshCw,
} from "lucide-react";
import { useAIToolStorage } from "@/lib/hooks/use-local-storage";

interface Question {
	id: number;
	question: string;
	options: string[];
	correctAnswer: number;
	explanation?: string;
}

interface QuizState {
	quiz: Question[] | null;
	answers: Record<number, number>;
	submitted: boolean;
}

interface AIQuizGeneratorProps {
	materialId: string;
}

export function AIQuizGenerator({ materialId }: AIQuizGeneratorProps) {
	// Cache quiz state in localStorage
	const [cachedQuizState, setCachedQuizState] = useAIToolStorage<QuizState>(
		"quiz",
		materialId,
		{ quiz: null, answers: {}, submitted: false }
	);

	const [quiz, setQuiz] = useState<Question[] | null>(cachedQuizState.quiz);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const [answers, setAnswers] = useState<Record<number, number>>(
		cachedQuizState.answers
	);
	const [submitted, setSubmitted] = useState(cachedQuizState.submitted);

	// Update cache whenever quiz state changes
	useEffect(() => {
		if (quiz !== null || Object.keys(answers).length > 0 || submitted) {
			const newState = { quiz, answers, submitted };
			const newStateStr = JSON.stringify(newState);
			const currentStateStr = JSON.stringify(cachedQuizState);

			// Only update cache if it's actually different
			if (newStateStr !== currentStateStr) {
				setCachedQuizState(newState);
			}
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [quiz, answers, submitted]);

	const generateQuiz = async () => {
		setIsLoading(true);
		setError(null);
		setAnswers({});
		setSubmitted(false);

		try {
			const response = await fetch("/api/ai/quiz", {
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ materialId }),
			});

			if (!response.ok) {
				const data = await response.json();
				throw new Error(data.error || "Failed to generate quiz");
			}

			const data = await response.json();
			setQuiz(data.questions);
		} catch (err) {
			console.error("Error generating quiz:", err);
			setError(
				err instanceof Error
					? err.message
					: "Failed to generate quiz. Please try again."
			);
		} finally {
			setIsLoading(false);
		}
	};

	const handleSubmit = () => {
		setSubmitted(true);
	};

	const score = submitted
		? Object.entries(answers).filter(
				([id, answer]) =>
					quiz?.find((q) => q.id === Number(id))?.correctAnswer === answer
		  ).length
		: 0;

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
						<span>Analyzing material and generating questions...</span>
					</div>
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
					<Skeleton className="h-24 w-full" />
				</div>
			)}

			{!isLoading && !quiz && (
				<div className="space-y-4">
					<p className="text-sm text-muted-foreground">
						Generate a quiz to test your understanding of this material.
					</p>
					<Button onClick={generateQuiz} className="w-full gap-2">
						<Sparkles className="h-4 w-4" />
						Generate Quiz
					</Button>
				</div>
			)}

			{!isLoading && quiz && (
				<div className="space-y-6">
					{quiz.map((question, idx) => (
						<Card key={question.id} className="p-4">
							<div className="space-y-3">
								<div className="flex items-start gap-2">
									<span className="font-semibold">{idx + 1}.</span>
									<p className="font-medium flex-1">{question.question}</p>
									{submitted &&
										(answers[question.id] === question.correctAnswer ? (
											<CheckCircle2 className="h-5 w-5 text-green-500 flex-shrink-0" />
										) : (
											<XCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
										))}
								</div>

								<RadioGroup
									value={answers[question.id]?.toString()}
									onValueChange={(value) =>
										setAnswers({ ...answers, [question.id]: Number(value) })
									}
									disabled={submitted}
								>
									{question.options.map((option, optIdx) => (
										<div key={optIdx} className="flex items-center space-x-2">
											<RadioGroupItem
												value={optIdx.toString()}
												id={`q${question.id}-opt${optIdx}`}
											/>
											<Label
												htmlFor={`q${question.id}-opt${optIdx}`}
												className={`flex-1 cursor-pointer ${
													submitted && optIdx === question.correctAnswer
														? "text-green-600 font-medium"
														: submitted && answers[question.id] === optIdx
														? "text-red-600"
														: ""
												}`}
											>
												{option}
											</Label>
										</div>
									))}
								</RadioGroup>

								{submitted && question.explanation && (
									<div className="mt-3 pt-3 border-t text-sm text-muted-foreground">
										<span className="font-medium">Explanation: </span>
										{question.explanation}
									</div>
								)}
							</div>
						</Card>
					))}

					{!submitted ? (
						<Button
							onClick={handleSubmit}
							className="w-full"
							disabled={Object.keys(answers).length !== quiz.length}
						>
							Submit Quiz
						</Button>
					) : (
						<div className="space-y-4">
							<Card className="p-4 bg-primary text-primary-foreground">
								<p className="text-center text-lg font-semibold">
									Score: {score} / {quiz.length}
								</p>
							</Card>
							<Button
								variant="outline"
								onClick={generateQuiz}
								className="w-full gap-2 bg-transparent"
							>
								<RefreshCw className="h-4 w-4" />
								Generate New Quiz
							</Button>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
