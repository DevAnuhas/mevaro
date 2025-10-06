"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import { Card } from "@/components/ui/card"
import { Sparkles } from "lucide-react"

interface Concept {
  name: string
  description: string
  importance: "high" | "medium" | "low"
}

interface AIConceptExtractionProps {
  materialId: string
}

export function AIConceptExtraction({ materialId }: AIConceptExtractionProps) {
  const [concepts, setConcepts] = useState<Concept[] | null>(null)
  const [loading, setLoading] = useState(false)

  const extractConcepts = async () => {
    setLoading(true)
    // Mock AI response
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setConcepts([
      {
        name: "Wave-Particle Duality",
        description: "The concept that all matter exhibits both wave and particle properties",
        importance: "high",
      },
      {
        name: "Uncertainty Principle",
        description: "The fundamental limit on the precision of measuring complementary properties",
        importance: "high",
      },
      {
        name: "Quantum Superposition",
        description: "The ability of quantum systems to exist in multiple states simultaneously",
        importance: "high",
      },
      {
        name: "Wave Function",
        description: "Mathematical description of the quantum state of a system",
        importance: "medium",
      },
      {
        name: "Quantum Entanglement",
        description: "Correlation between quantum particles regardless of distance",
        importance: "medium",
      },
      {
        name: "Schrödinger Equation",
        description: "Fundamental equation describing how quantum states evolve over time",
        importance: "high",
      },
    ])
    setLoading(false)
  }

  const importanceColors = {
    high: "bg-red-500",
    medium: "bg-orange-500",
    low: "bg-yellow-500",
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">
        Extract key concepts, keywords, and important topics from this material.
      </p>

      {!concepts && !loading && (
        <Button onClick={extractConcepts} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Extract Concepts
        </Button>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      )}

      {concepts && (
        <div className="space-y-4">
          <div className="grid gap-3">
            {concepts.map((concept, idx) => (
              <Card key={idx} className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between gap-2">
                    <h4 className="font-semibold">{concept.name}</h4>
                    <Badge className={`${importanceColors[concept.importance]} text-white text-xs`}>
                      {concept.importance}
                    </Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">{concept.description}</p>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="outline" onClick={extractConcepts} className="w-full gap-2 bg-transparent">
            <Sparkles className="h-4 w-4" />
            Re-extract Concepts
          </Button>
        </div>
      )}
    </div>
  )
}
