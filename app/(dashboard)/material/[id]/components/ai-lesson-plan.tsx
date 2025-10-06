"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { Sparkles, CheckCircle2 } from "lucide-react"

interface LessonSection {
  title: string
  duration: string
  content: string[]
}

interface AILessonPlanProps {
  materialId: string
}

export function AILessonPlan({ materialId }: AILessonPlanProps) {
  const [lessonPlan, setLessonPlan] = useState<LessonSection[] | null>(null)
  const [loading, setLoading] = useState(false)

  const generateLessonPlan = async () => {
    setLoading(true)
    // Mock AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setLessonPlan([
      {
        title: "Introduction & Overview",
        duration: "15 minutes",
        content: [
          "Review classical physics limitations",
          "Introduce the quantum realm and its significance",
          "Discuss historical context and key experiments",
        ],
      },
      {
        title: "Wave-Particle Duality",
        duration: "25 minutes",
        content: [
          "Explain the double-slit experiment",
          "Demonstrate wave and particle behaviors",
          "Discuss implications for understanding matter",
          "Interactive examples and demonstrations",
        ],
      },
      {
        title: "Uncertainty Principle",
        duration: "20 minutes",
        content: [
          "Introduce Heisenberg Uncertainty Principle",
          "Mathematical formulation and interpretation",
          "Real-world applications and examples",
          "Common misconceptions and clarifications",
        ],
      },
      {
        title: "Quantum States & Superposition",
        duration: "25 minutes",
        content: [
          "Define quantum states and wave functions",
          "Explain superposition principle",
          "Schrödinger cat thought experiment",
          "Measurement and wave function collapse",
        ],
      },
      {
        title: "Review & Assessment",
        duration: "15 minutes",
        content: [
          "Recap key concepts covered",
          "Q&A session for clarifications",
          "Quick assessment quiz",
          "Preview of next topics",
        ],
      },
    ])
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Generate a structured lesson plan or study guide based on this material.
      </p>

      {!lessonPlan && !loading && (
        <Button onClick={generateLessonPlan} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Lesson Plan
        </Button>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      )}

      {lessonPlan && (
        <div className="space-y-4">
          <div className="space-y-4">
            {lessonPlan.map((section, idx) => (
              <Card key={idx} className="p-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="font-semibold">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.duration}</p>
                    </div>
                    <span className="text-sm font-medium text-primary">Step {idx + 1}</span>
                  </div>
                  <ul className="space-y-2">
                    {section.content.map((item, itemIdx) => (
                      <li key={itemIdx} className="flex items-start gap-2 text-sm">
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
            <p className="text-2xl font-bold text-primary">100 minutes</p>
          </div>

          <Button variant="outline" onClick={generateLessonPlan} className="w-full gap-2 bg-transparent">
            <Sparkles className="h-4 w-4" />
            Regenerate Lesson Plan
          </Button>
        </div>
      )}
    </div>
  )
}
