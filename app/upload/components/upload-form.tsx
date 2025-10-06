"use client";

import type React from "react";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { FileUploadZone } from "./file-upload-zone";
import { CategorySelector } from "./category-selector";
import { KeywordInput } from "./keyword-input";
import { UploadPreview } from "./upload-preview";
import { CheckCircle2 } from "lucide-react";
import { toast } from "sonner";
import {
	uploadFormSchema,
	type UploadFormData,
} from "@/lib/validations/material";

export function UploadForm() {
	const router = useRouter();
	const [isUploading, setIsUploading] = useState(false);
	const [uploadSuccess, setUploadSuccess] = useState(false);
	const [filePreviewUrl, setFilePreviewUrl] = useState<string | null>(null);

	const {
		control,
		register,
		handleSubmit,
		setValue,
		watch,
		formState: { errors, isValid },
	} = useForm<UploadFormData>({
		resolver: zodResolver(uploadFormSchema),
		mode: "onChange",
		defaultValues: {
			title: "",
			description: "",
			keywords: [],
		},
	});

	const watchedFile = watch("file");

	const handleFileSelect = (file: File, previewUrl: string) => {
		setValue("file", file, { shouldValidate: true });
		setFilePreviewUrl(previewUrl);
	};

	const handleFileRemove = () => {
		setValue("file", undefined, { shouldValidate: true });
		setFilePreviewUrl(null);
	};

	const onSubmit = async (data: UploadFormData) => {
		setIsUploading(true);

		try {
			if (!data.file) {
				throw new Error("File is required");
			}

			// Prepare form data for upload
			const formData = new FormData();
			formData.append("file", data.file);
			formData.append("title", data.title);
			formData.append("description", data.description || "");
			formData.append("category", data.category);
			formData.append("keywords", JSON.stringify(data.keywords));

			// Upload to API
			const response = await fetch("/api/materials/upload", {
				method: "POST",
				body: formData,
			});

			const result = await response.json();

			if (!response.ok) {
				throw new Error(result.error || "Upload failed");
			}

			// Show success notification
			toast.success("Material uploaded successfully!", {
				description: "Your material is pending approval.",
			});

			setUploadSuccess(true);
		} catch (error) {
			console.error("Upload failed:", error);
			toast.error("Upload failed", {
				description:
					error instanceof Error ? error.message : "Please try again.",
			});
		} finally {
			setIsUploading(false);
		}
	};

	if (uploadSuccess) {
		return (
			<Card className="border-primary">
				<CardContent className="pt-6">
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<CheckCircle2 className="h-16 w-16 text-primary mb-4" />
						<h2 className="text-2xl font-bold mb-2">Upload Successful!</h2>
						<p className="text-muted-foreground mb-4 max-w-md">
							Your material has been submitted and is pending approval.
							You&apos;ll be notified once it&apos;s reviewed by our team.
						</p>
						<Button onClick={() => router.push("/library")}>
							Go to Library
						</Button>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
			<Card>
				<CardHeader>
					<CardTitle>Material Details</CardTitle>
					<CardDescription>
						Provide information about your educational resource
					</CardDescription>
				</CardHeader>
				<CardContent className="space-y-4">
					<div className="space-y-2">
						<Label htmlFor="title">Title</Label>
						<Input
							id="title"
							placeholder="e.g., Introduction to Quantum Physics"
							{...register("title")}
						/>
						{errors.title && (
							<p className="text-sm text-red-500">{errors.title.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Label htmlFor="description">Description</Label>
						<Textarea
							id="description"
							placeholder="Describe what this material covers and who it's for..."
							rows={4}
							{...register("description")}
						/>
						{errors.description && (
							<p className="text-sm text-red-500">
								{errors.description.message}
							</p>
						)}
					</div>

					<div className="space-y-2">
						<Controller
							name="category"
							control={control}
							render={({ field }) => (
								<CategorySelector
									value={field.value || null}
									onChange={(category) => field.onChange(category)}
								/>
							)}
						/>
						{errors.category && (
							<p className="text-sm text-red-500">{errors.category.message}</p>
						)}
					</div>

					<div className="space-y-2">
						<Controller
							name="keywords"
							control={control}
							render={({ field }) => (
								<KeywordInput value={field.value} onChange={field.onChange} />
							)}
						/>
						{errors.keywords && (
							<p className="text-sm text-red-500">{errors.keywords.message}</p>
						)}
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle>Upload File</CardTitle>
					<CardDescription>
						Upload your material as a PDF or image file (PNG, JPEG)
					</CardDescription>
				</CardHeader>
				<CardContent>
					<FileUploadZone
						onFileSelect={handleFileSelect}
						acceptedTypes={["application/pdf", "image/png", "image/jpeg"]}
					/>
					{errors.file && (
						<p className="text-sm text-red-500 mt-2">{errors.file.message}</p>
					)}
				</CardContent>
			</Card>

			{watchedFile && filePreviewUrl && (
				<UploadPreview
					file={watchedFile}
					previewUrl={filePreviewUrl}
					onRemove={handleFileRemove}
				/>
			)}

			<div className="flex justify-end gap-4">
				<Button
					type="button"
					variant="outline"
					onClick={() => router.push("/library")}
					disabled={isUploading}
				>
					Cancel
				</Button>
				<Button type="submit" disabled={!isValid || isUploading}>
					{isUploading ? (
						<>
							<Spinner />
							Uploading...
						</>
					) : (
						"Submit for Review"
					)}
				</Button>
			</div>
		</form>
	);
}
