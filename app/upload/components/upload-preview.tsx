"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { FileText, ImageIcon, X } from "lucide-react"

interface UploadPreviewProps {
  file: File
  previewUrl: string
  onRemove: () => void
}

export function UploadPreview({ file, previewUrl, onRemove }: UploadPreviewProps) {
  const isPDF = file.type === "application/pdf"
  const isImage = file.type.startsWith("image/")

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Preview</CardTitle>
          <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
            {isPDF ? <FileText className="h-8 w-8 text-red-500" /> : <ImageIcon className="h-8 w-8 text-blue-500" />}
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-sm text-muted-foreground">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          </div>

          {isImage && (
            <div className="border rounded-lg overflow-hidden">
              <img
                src={previewUrl || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-auto max-h-96 object-contain"
              />
            </div>
          )}

          {isPDF && (
            <div className="border rounded-lg p-8 text-center bg-muted/50">
              <FileText className="h-16 w-16 text-muted-foreground mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">PDF preview will be available after upload</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
