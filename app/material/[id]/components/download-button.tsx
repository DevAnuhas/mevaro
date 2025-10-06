"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import { incrementDownloadCount } from "../actions";
import { toast } from "sonner";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

interface DownloadButtonProps {
	materialId: string;
	fileUrl: string;
	fileName: string;
}

export function DownloadButton({
	materialId,
	fileUrl,
	fileName,
}: DownloadButtonProps) {
	const [isDownloading, setIsDownloading] = useState(false);

	const handleDownload = async () => {
		setIsDownloading(true);
		try {
			// Increment download count
			await incrementDownloadCount(materialId);

			// Trigger download
			const link = document.createElement("a");
			link.href = fileUrl;
			link.download = fileName;
			document.body.appendChild(link);
			link.click();
			document.body.removeChild(link);
		} catch (error) {
			console.error("Download failed:", error);
			toast.error("Failed to download material");
		} finally {
			setIsDownloading(false);
		}
	};

	return (
		<Button
			size="lg"
			className="gap-2"
			onClick={handleDownload}
			disabled={isDownloading}
		>
			{isDownloading ? (
				<>
					<Spinner />
					Downloading...
				</>
			) : (
				<>
					<Download className="h-5 w-5" />
					Download
				</>
			)}
		</Button>
	);
}
