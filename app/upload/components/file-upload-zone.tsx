"use client"

import type React from "react"

import { useState, useCallback } from "react"
import { Upload, FileText, ImageIcon } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileUploadZoneProps {
  onFileSelect: (file: File, previewUrl: string) => void
  acceptedTypes: string[]
}

export function FileUploadZone({ onFileSelect, acceptedTypes }: FileUploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const processFile = useCallback(
    (file: File) => {
      if (!acceptedTypes.includes(file.type)) {
        alert("Please upload a PDF or image file (PNG, JPEG)")
        return
      }

      // Mock upload progress
      setUploadProgress(0)
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval)
            return 100
          }
          return prev + 10
        })
      }, 100)

      // Create preview URL
      const previewUrl = URL.createObjectURL(file)

      setTimeout(() => {
        onFileSelect(file, previewUrl)
        setUploadProgress(0)
      }, 1200)
    },
    [acceptedTypes, onFileSelect],
  )

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)

      const file = e.dataTransfer.files[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0]
      if (file) {
        processFile(file)
      }
    },
    [processFile],
  )

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "border-2 border-dashed rounded-lg p-12 text-center transition-colors cursor-pointer",
        isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50",
      )}
    >
      <input
        type="file"
        id="file-upload"
        className="hidden"
        accept={acceptedTypes.join(",")}
        onChange={handleFileInput}
      />

      <label htmlFor="file-upload" className="cursor-pointer">
        <div className="flex flex-col items-center gap-4">
          <div className="p-4 rounded-full bg-muted">
            <Upload className="h-8 w-8 text-muted-foreground" />
          </div>

          <div>
            <p className="text-lg font-medium mb-1">Drop your file here or click to browse</p>
            <p className="text-sm text-muted-foreground">Supports PDF, PNG, and JPEG files</p>
          </div>

          <div className="flex gap-4 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              <span>PDF</span>
            </div>
            <div className="flex items-center gap-1">
              <ImageIcon className="h-4 w-4" />
              <span>PNG/JPEG</span>
            </div>
          </div>
        </div>
      </label>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="mt-4">
          <div className="w-full bg-muted rounded-full h-2">
            <div
              className="bg-primary h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">Uploading... {uploadProgress}%</p>
        </div>
      )}
    </div>
  )
}
