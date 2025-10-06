import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface MaterialCardsSkeletonProps {
	viewMode: "grid" | "list";
	count?: number;
}

export default function MaterialCardsSkeleton({
	viewMode,
	count = 6,
}: MaterialCardsSkeletonProps) {
	return (
		<div
			className={
				viewMode === "grid"
					? "grid gap-6 lg:grid-cols-3 sm:grid-cols-2"
					: "space-y-4"
			}
		>
			{Array.from({ length: count }).map((_, index) =>
				viewMode === "grid" ? (
					<Card key={index} className="border-border bg-card h-full">
						<div className="p-6 h-full flex flex-col">
							<div className="mb-4 flex items-start justify-between">
								<Skeleton className="h-12 w-12 rounded-lg" />
								<Skeleton className="h-5 w-20" />
							</div>

							<Skeleton className="h-6 w-3/4 mb-2" />
							<Skeleton className="h-4 w-full mb-2" />
							<Skeleton className="h-4 w-5/6 mb-4" />

							<div className="mb-4 flex flex-wrap gap-2">
								<Skeleton className="h-5 w-16" />
								<Skeleton className="h-5 w-20" />
							</div>

							<div className="flex items-center justify-between border-t border-border mt-auto pt-4">
								<Skeleton className="h-4 w-24" />
								<div className="flex items-center gap-3">
									<Skeleton className="h-4 w-12" />
									<Skeleton className="h-4 w-12" />
								</div>
							</div>
						</div>
					</Card>
				) : (
					<Card key={index} className="border-border bg-card">
						<div className="flex gap-6 p-6">
							<Skeleton className="h-16 w-16 shrink-0 rounded-lg" />

							<div className="flex-1">
								<div className="mb-2 flex items-start justify-between">
									<Skeleton className="h-6 w-1/2" />
									<Skeleton className="h-5 w-20" />
								</div>

								<Skeleton className="h-4 w-full mb-2" />
								<Skeleton className="h-4 w-4/5 mb-3" />

								<div className="mb-3 flex flex-wrap gap-2">
									<Skeleton className="h-5 w-16" />
									<Skeleton className="h-5 w-20" />
								</div>

								<div className="flex items-center justify-between">
									<Skeleton className="h-4 w-24" />
									<div className="flex items-center gap-4">
										<Skeleton className="h-4 w-24" />
										<Skeleton className="h-4 w-20" />
										<Skeleton className="h-4 w-24" />
									</div>
								</div>
							</div>
						</div>
					</Card>
				)
			)}
		</div>
	);
}
