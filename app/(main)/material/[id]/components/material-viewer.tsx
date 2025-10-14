"use client"

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button"
import {
	ZoomIn,
	ZoomOut,
	RotateCw,
	Maximize2,
	Download,
	ChevronLeft,
	ChevronRight,
} from "lucide-react";

interface MaterialViewerProps {
	fileUrl: string;
	fileType: string;
	title: string;
}

export function MaterialViewer({
	fileUrl,
	fileType,
	title,
}: MaterialViewerProps) {
	const [zoom, setZoom] = useState(100);
	const [rotation, setRotation] = useState(0);
	const [isDragging, setIsDragging] = useState(false);
	const [position, setPosition] = useState({ x: 0, y: 0 });
	const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
	const [isFullscreen, setIsFullscreen] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const containerRef = useRef<HTMLDivElement>(null);
	const imageRef = useRef<HTMLImageElement>(null);

	// Determine if the file is a PDF or an image
	const isPdf = fileType.toLowerCase().includes("pdf");
	const isImage = fileType.toLowerCase().match(/jpe?g|png|gif|bmp|webp|svg/);

	// Handle mouse drag for panning
	const handleMouseDown = (e: React.MouseEvent) => {
		if (zoom <= 100 || isPdf) return;
		setIsDragging(true);
		setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
	};

	const handleMouseMove = (e: React.MouseEvent) => {
		if (!isDragging) return;
		setPosition({
			x: e.clientX - dragStart.x,
			y: e.clientY - dragStart.y,
		});
	};

	const handleMouseUp = () => {
		setIsDragging(false);
	};

	// Reset position when zoom changes
	useEffect(() => {
		if (zoom === 100) {
			setPosition({ x: 0, y: 0 });
		}
	}, [zoom]);

	// Handle fullscreen
	const toggleFullscreen = () => {
		if (!containerRef.current) return;

		if (!isFullscreen) {
			if (containerRef.current.requestFullscreen) {
				containerRef.current.requestFullscreen();
			}
		} else {
			if (document.exitFullscreen) {
				document.exitFullscreen();
			}
		}
	};

	useEffect(() => {
		const handleFullscreenChange = () => {
			setIsFullscreen(!!document.fullscreenElement);
		};

		document.addEventListener("fullscreenchange", handleFullscreenChange);
		return () => {
			document.removeEventListener("fullscreenchange", handleFullscreenChange);
		};
	}, []);

	// Zoom controls
	const handleZoomIn = () => setZoom((z) => Math.min(200, z + 25));
	const handleZoomOut = () => setZoom((z) => Math.max(50, z - 25));
	const handleRotate = () => setRotation((r) => (r + 90) % 360);
	const handleReset = () => {
		setZoom(100);
		setRotation(0);
		setPosition({ x: 0, y: 0 });
	};

	return (
		<div className="space-y-4">
			{/* Viewer Controls */}
			<div className="flex items-center justify-between flex-wrap gap-2">
				{/* {isPdf && (
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
						>
							<ChevronLeft className="h-4 w-4" />
						</Button>
						<span className="text-sm">Page {currentPage}</span>
						<Button
							variant="outline"
							size="sm"
							onClick={() => setCurrentPage((p) => p + 1)}
						>
							<ChevronRight className="h-4 w-4" />
						</Button>
					</div>
				)} */}

				<div className="flex items-center gap-2 ml-auto">
					{isImage && (
						<>
							<Button
								variant="outline"
								size="sm"
								onClick={handleZoomOut}
								disabled={zoom <= 50}
								title="Zoom out"
							>
								<ZoomOut className="h-4 w-4" />
							</Button>
							<span className="text-sm w-14 text-center">{zoom}%</span>
							<Button
								variant="outline"
								size="sm"
								onClick={handleZoomIn}
								disabled={zoom >= 200}
								title="Zoom in"
							>
								<ZoomIn className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleRotate}
								title="Rotate"
							>
								<RotateCw className="h-4 w-4" />
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={handleReset}
								title="Reset view"
							>
								Reset
							</Button>
						</>
					)}
					<Button
						variant="outline"
						size="sm"
						onClick={toggleFullscreen}
						title="Fullscreen"
					>
						<Maximize2 className="h-4 w-4" />
					</Button>
				</div>
			</div>

			{/* Viewer */}
			<div
				ref={containerRef}
				className="border rounded-lg overflow-hidden bg-muted relative"
				style={{ minHeight: "600px" }}
			>
				{isPdf ? (
					// PDF Viewer using iframe
					<iframe
						src={`${fileUrl}#page=${currentPage}&toolbar=1&navpanes=0`}
						className="w-full h-full"
						style={{ minHeight: "600px" }}
						title={title}
					/>
				) : isImage ? (
					// Image Viewer with zoom and pan
					<div
						className="flex items-center justify-center w-full h-full cursor-move"
						style={{ minHeight: "600px" }}
						onMouseDown={handleMouseDown}
						onMouseMove={handleMouseMove}
						onMouseUp={handleMouseUp}
						onMouseLeave={handleMouseUp}
					>
						<img
							ref={imageRef}
							src={fileUrl}
							alt={title}
							className="max-w-full max-h-full object-contain select-none transition-transform"
							style={{
								transform: `scale(${
									zoom / 100
								}) rotate(${rotation}deg) translate(${position.x}px, ${
									position.y
								}px)`,
								cursor:
									zoom > 100 ? (isDragging ? "grabbing" : "grab") : "default",
							}}
							draggable={false}
						/>
					</div>
				) : (
					// Fallback for unsupported file types
					<div className="flex items-center justify-center h-full p-8">
						<div className="text-center space-y-4">
							<Download className="h-12 w-12 mx-auto text-muted-foreground" />
							<p className="text-muted-foreground">
								Preview not available for this file type.
							</p>
							<p className="text-sm text-muted-foreground">
								Please download the file to view it.
							</p>
						</div>
					</div>
				)}
			</div>

			{isImage && zoom > 100 && (
				<p className="text-xs text-muted-foreground text-center">
					Tip: Click and drag to pan the image
				</p>
			)}
		</div>
	);
}
