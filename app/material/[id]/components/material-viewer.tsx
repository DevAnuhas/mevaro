"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react"

interface MaterialViewerProps {
  fileUrl: string
  fileType: "pdf" | "image"
  title: string
}

export function MaterialViewer({ fileUrl, fileType, title }: MaterialViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [zoom, setZoom] = useState(100)
  const totalPages = 12 // Mock total pages

  return (
    <div className="space-y-4">
      {/* Viewer Controls */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-sm">
            Page {currentPage} of {totalPages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{zoom}%</span>
          <Button variant="outline" size="sm" onClick={() => setZoom((z) => Math.min(200, z + 10))}>
            <ZoomIn className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Viewer */}
      <div className="border rounded-lg overflow-hidden bg-muted">
        <div className="flex items-center justify-center p-8" style={{ minHeight: "600px" }}>
          <img
            src={fileUrl || "/placeholder.svg"}
            alt={title}
            className="max-w-full h-auto rounded shadow-lg"
            style={{ transform: `scale(${zoom / 100})` }}
          />
        </div>
      </div>
    </div>
  )
}
