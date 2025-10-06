"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { Sparkles } from "lucide-react"

interface AISummarizationProps {
  materialId: string
}

export function AISummarization({ materialId }: AISummarizationProps) {
  const [summary, setSummary] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const generateSummary = async () => {
    setLoading(true)
    // Mock AI response - in production, this would call AI SDK
    await new Promise((resolve) => setTimeout(resolve, 2000))
    setSummary(
      "This material provides a comprehensive introduction to quantum mechanics, covering fundamental concepts such as wave-particle duality, the uncertainty principle, and quantum states. Key topics include:\n\n• Wave functions and probability distributions\n• The Schrödinger equation and its applications\n• Quantum superposition and entanglement\n• Measurement and observation effects\n• Applications in modern physics and technology\n\nThe content is suitable for undergraduate physics students and provides a solid foundation for advanced quantum theory studies.",
    )
    setLoading(false)
  }

  return (
    <div className="space-y-4">
      <p className="text-sm text-muted-foreground">Generate a concise summary of this material using AI.</p>

      {!summary && !loading && (
        <Button onClick={generateSummary} className="w-full gap-2">
          <Sparkles className="h-4 w-4" />
          Generate Summary
        </Button>
      )}

      {loading && (
        <div className="space-y-3">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      )}

      {summary && (
        <div className="space-y-4">
          <div className="prose prose-sm max-w-none">
            <p className="whitespace-pre-line">{summary}</p>
          </div>
          <Button variant="outline" onClick={generateSummary} className="w-full gap-2 bg-transparent">
            <Sparkles className="h-4 w-4" />
            Regenerate
          </Button>
        </div>
      )}
    </div>
  )
}
