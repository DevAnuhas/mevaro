"use client";

import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Share2, Copy, Check } from "lucide-react";
import { toast } from "sonner";
import { useState } from "react";

interface ShareButtonProps {
	materialId: string;
	materialTitle: string;
}

export function ShareButton({ materialId, materialTitle }: ShareButtonProps) {
	const [copied, setCopied] = useState(false);
	const [open, setOpen] = useState(false);

	// Generate share URL
	const shareUrl =
		typeof window !== "undefined"
			? `${window.location.origin}/material/${materialId}`
			: "";

	const handleCopyLink = async () => {
		try {
			await navigator.clipboard.writeText(shareUrl);
			setCopied(true);
			toast.success("Link copied to clipboard!");

			// Reset copied state after 2 seconds
			setTimeout(() => {
				setCopied(false);
			}, 2000);
		} catch (error) {
			console.error("Failed to copy link:", error);
			toast.error("Failed to copy link");
		}
	};

	const handleNativeShare = async () => {
		if (navigator.share) {
			try {
				await navigator.share({
					title: materialTitle,
					text: `Check out this educational material: ${materialTitle}`,
					url: shareUrl,
				});
			} catch (error) {
				// User cancelled the share or share failed
				if ((error as Error).name !== "AbortError") {
					console.error("Failed to share:", error);
					toast.error("Failed to share");
				}
			}
		} else {
			// Fallback to copy link if native share is not supported
			handleCopyLink();
		}
	};

	return (
		<Dialog open={open} onOpenChange={setOpen}>
			<DialogTrigger asChild>
				<Button variant="outline" size="default" className="gap-2">
					<Share2 className="h-4 w-4" />
					Share
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-md">
				<DialogHeader>
					<DialogTitle>Share Material</DialogTitle>
					<DialogDescription>
						Share this educational material with others
					</DialogDescription>
				</DialogHeader>
				<div className="flex flex-col gap-4">
					<div className="flex items-center space-x-2">
						<div className="grid flex-1 gap-2">
							<Label htmlFor="link" className="sr-only">
								Link
							</Label>
							<Input id="link" value={shareUrl} readOnly className="h-9" />
						</div>
						<Button
							type="button"
							size="sm"
							className="px-3"
							onClick={handleCopyLink}
						>
							<span className="sr-only">Copy</span>
							{copied ? (
								<Check className="h-4 w-4" />
							) : (
								<Copy className="h-4 w-4" />
							)}
						</Button>
					</div>
					{typeof window !== "undefined" && "share" in navigator && (
						<Button
							type="button"
							variant="secondary"
							onClick={handleNativeShare}
							className="gap-2"
						>
							<Share2 className="h-4 w-4" />
							Share via...
						</Button>
					)}
				</div>
			</DialogContent>
		</Dialog>
	);
}
