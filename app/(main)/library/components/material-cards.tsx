"use client";

import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Download,
	Eye,
	Calendar,
	User,
	FileText,
	ImageIcon,
} from "lucide-react";
import Link from "next/link";
import type { Material, User as PrismaUser } from "@prisma/client";

type MaterialWithUploader = Material & {
	uploader: Pick<PrismaUser, "id" | "name" | "email">;
};

const STEAM_CATEGORIES = [
	{ id: "SCIENCE", name: "Science", color: "oklch(0.55 0.20 150)" },
	{ id: "TECHNOLOGY", name: "Technology", color: "oklch(0.60 0.18 220)" },
	{ id: "ENGINEERING", name: "Engineering", color: "oklch(0.65 0.15 30)" },
	{ id: "ARTS", name: "Arts", color: "oklch(0.50 0.22 280)" },
	{ id: "MATHEMATICS", name: "Mathematics", color: "oklch(0.70 0.18 60)" },
];

interface MaterialCardsProps {
	materials: MaterialWithUploader[];
	viewMode: "grid" | "list";
}

export default function MaterialCards({
	materials,
	viewMode,
}: MaterialCardsProps) {
	if (materials.length === 0) {
		return (
			<Card className="border-border bg-card p-12 text-center">
				<p className="text-muted-foreground">
					No materials found matching your criteria.
				</p>
			</Card>
		);
	}

	return (
		<div
			className={
				viewMode === "grid"
					? "grid gap-6 lg:grid-cols-3 sm:grid-cols-2"
					: "space-y-4"
			}
		>
			{materials.map((material) => {
				const category = STEAM_CATEGORIES.find(
					(cat) => cat.id === material.category
				);

				return viewMode === "grid" ? (
					<Link key={material.id} href={`/material/${material.id}`} passHref>
						<Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary h-full">
							<div className="p-6 h-full flex flex-col">
								<div className="mb-4 flex items-start justify-between">
									<div
										className="flex h-12 w-12 items-center justify-center rounded-lg"
										style={{ backgroundColor: category?.color }}
									>
										{material.fileType.includes("pdf") ? (
											<FileText className="h-6 w-6 text-white" />
										) : (
											<ImageIcon className="h-6 w-6 text-white" />
										)}
									</div>
									<Badge variant="secondary" className="text-xs">
										{category?.name}
									</Badge>
								</div>

								<h3 className="mb-2 line-clamp-2 text-lg font-semibold">
									{material.title}
								</h3>
								<p className="mb-4 line-clamp-3 text-sm text-muted-foreground leading-relaxed">
									{material.description || "No description available"}
								</p>

								<div className="mb-4 flex flex-wrap gap-2">
									{material.keywords.slice(0, 3).map((item) => (
										<Badge key={item} variant="outline" className="text-xs">
											{item}
										</Badge>
									))}
								</div>

								<div className="flex items-center justify-between border-t border-border mt-auto pt-4 text-xs text-muted-foreground">
									<div className="flex items-center gap-1">
										<User className="h-3 w-3" />
										<span className="truncate max-w-[120px]">
											{material.uploader.name}
										</span>
									</div>
									<div className="flex items-center gap-3">
										<div className="flex items-center gap-1">
											<Download className="h-3 w-3" />
											<span>{material.downloadCount}</span>
										</div>
										<div className="flex items-center gap-1">
											<Eye className="h-3 w-3" />
											<span>{material.viewCount}</span>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</Link>
				) : (
					<Link key={material.id} href={`/material/${material.id}`} passHref>
						<Card className="group cursor-pointer border-border bg-card transition-all hover:border-primary">
							<div className="flex gap-6 p-6">
								<div
									className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg"
									style={{ backgroundColor: category?.color }}
								>
									{material.fileType.includes("pdf") ? (
										<FileText className="h-8 w-8 text-white" />
									) : (
										<ImageIcon className="h-8 w-8 text-white" />
									)}
								</div>

								<div className="flex-1">
									<div className="mb-2 flex items-start justify-between">
										<h3 className="text-lg font-semibold">{material.title}</h3>
										<Badge variant="secondary" className="text-xs">
											{category?.name}
										</Badge>
									</div>

									<p className="mb-3 text-sm text-muted-foreground leading-relaxed">
										{material.description || "No description available"}
									</p>

									<div className="mb-3 flex flex-wrap gap-2">
										{material.keywords.slice(0, 5).map((item) => (
											<Badge key={item} variant="outline" className="text-xs">
												{item}
											</Badge>
										))}
									</div>

									<div className="flex items-center justify-between text-xs text-muted-foreground">
										<div className="flex items-center gap-1">
											<User className="h-3 w-3" />
											<span>{material.uploader.name}</span>
										</div>
										<div className="flex items-center gap-4">
											<div className="flex items-center gap-1">
												<Download className="h-3 w-3" />
												<span>{material.downloadCount} downloads</span>
											</div>
											<div className="flex items-center gap-1">
												<Eye className="h-3 w-3" />
												<span>{material.viewCount} views</span>
											</div>
											<div className="flex items-center gap-1">
												<Calendar className="h-3 w-3" />
												<span>
													{new Date(material.createdAt).toLocaleDateString()}
												</span>
											</div>
										</div>
									</div>
								</div>
							</div>
						</Card>
					</Link>
				);
			})}
		</div>
	);
}
