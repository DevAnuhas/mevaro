"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Sparkles, CheckCircle2, XCircle } from "lucide-react"

interface Question {
  id: number
  question: string
  options: string[]
  correctAnswer: number
}

interface AIQuizGeneratorProps {
  materialId: string
}

export function AIQuizGenerator({ materialId }: AIQuizGeneratorProps) {
  const [quiz, setQuiz] = useState<Question[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [answers, setAnswers] = useState<Record<number, number>>({})
  const [submitted, setSubmitted] = useState(false)

  const generateQuiz = async () => {
    setLoading(true)
    setAnswers({})
    setSubmitted(false)
    // Mock AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setQuiz([
      {
        id: 1,
        question: "What is the fundamental principle of wave-particle duality?",
        options: [
          "Particles can only behave as waves",
          "Light exhibits both wave and particle properties",
          "Waves cannot be particles",
          "Only electrons show dual behavior",
        ],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does the Heisenberg Uncertainty Principle state?",
        options: [
          "Energy is always conserved",
          "Position and momentum cannot both be precisely measured",
          "Particles move in straight lines",
          "Time is relative",
        ],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is quantum superposition?",
        options: [
          "Adding two quantum states",
          "A particle existing in multiple states simultaneously",
          "The speed of quantum particles",
          "The mass of a quantum system",
        ],
        correctAnswer: 1,
      },
    ])
    setLoading(false)
  }

  const handleSubmit = () => {
    setSubmitted(true)
  }

  const score = submitted
    ? Object.entries(answers).filter(([id, answer]) => quiz?.find((q) => q.id === Number(id))?.correctAnswer === answer)
        .length
    : 0

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Generate a quiz to test your understanding of this material.</p>

      {!quiz && !loading && (
        <Button onClick={generateQuiz} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Quiz
        </Button>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      )}

      {quiz && (
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
                  onValueChange={(value) => setAnswers({ ...answers, [question.id]: Number(value) })}
                  disabled={submitted}
                >
                  {question.options.map((option, optIdx) => (
                    <div key={optIdx} className="flex items-center space-x-2">
                      <RadioGroupItem value={optIdx.toString()} id={`q${question.id}-opt${optIdx}`} />
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
              </div>
            </Card>
          ))}

          {!submitted ? (
            <Button onClick={handleSubmit} className="w-full" disabled={Object.keys(answers).length !== quiz.length}>
              Submit Quiz
            </Button>
          ) : (
            <div className="space-y-3">
              <Card className="p-4 bg-primary text-primary-foreground">
                <p className="text-center text-lg font-semibold">
                  Score: {score} / {quiz.length}
                </p>
              </Card>
              <Button variant="outline" onClick={generateQuiz} className="w-full gap-2 bg-transparent">
                <Sparkles className="h-4 w-4" />
                Generate New Quiz
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
