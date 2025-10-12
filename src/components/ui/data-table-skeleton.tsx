import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface DataTableSkeletonProps {
	columns?: number;
	rows?: number;
	showHeader?: boolean;
	showToolbar?: boolean;
}

export function DataTableSkeleton({
	columns = 6,
	rows = 10,
	showHeader = true,
	showToolbar = true,
}: DataTableSkeletonProps) {
	return (
		<Card>
			{showHeader && (
				<CardHeader className="space-y-4">
					<div className="flex items-center justify-between">
						<div className="space-y-2">
							<Skeleton className="h-6 w-48" />
							<Skeleton className="h-4 w-64" />
						</div>
					</div>
				</CardHeader>
			)}

			<CardContent className="space-y-4">
				{/* Toolbar Skeleton */}
				{showToolbar && (
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-[350px]" />
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-8 w-20" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-16" />
							<Skeleton className="h-8 w-32" />
						</div>
					</div>
				)}

				{/* Table Skeleton */}
				<div className="rounded-md border">
					{/* Table Header */}
					<div className="bg-muted/50 border-b p-4">
						<div className="flex items-center space-x-4">
							{Array.from({ length: columns }, (_, i) => (
								<Skeleton key={i} className="h-4 w-20 flex-1" />
							))}
						</div>
					</div>

					{/* Table Rows */}
					<div className="divide-y">
						{Array.from({ length: rows }, (_, rowIndex) => (
							<div key={rowIndex} className="p-4">
								<div className="flex items-center space-x-4">
									{Array.from({ length: columns }, (_, colIndex) => (
										<div key={colIndex} className="flex-1">
											{colIndex === 0 ? (
												// First column (name with avatar)
												<div className="flex items-center space-x-3">
													<Skeleton className="h-10 w-10 rounded-full" />
													<Skeleton className="h-4 w-32" />
												</div>
											) : (
												// Other columns
												<Skeleton className="mx-auto h-4 w-20" />
											)}
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Pagination Skeleton */}
				<div className="flex items-center justify-between">
					<div />
					<div className="flex items-center space-x-6">
						<div className="flex items-center space-x-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-8 w-16" />
						</div>
						<Skeleton className="h-4 w-20" />
						<div className="flex items-center space-x-2">
							<Skeleton className="h-8 w-8" />
							<Skeleton className="h-8 w-8" />
							<Skeleton className="h-8 w-8" />
							<Skeleton className="h-8 w-8" />
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}

// Simple loading component for smaller areas
export function TableRowSkeleton({ columns = 6 }: { columns?: number }) {
	return (
		<div className="p-4">
			<div className="flex items-center space-x-4">
				{Array.from({ length: columns }, (_, colIndex) => (
					<div key={colIndex} className="flex-1">
						{colIndex === 0 ? (
							<div className="flex items-center space-x-3">
								<Skeleton className="h-10 w-10 rounded-full" />
								<Skeleton className="h-4 w-32" />
							</div>
						) : (
							<Skeleton className="mx-auto h-4 w-20" />
						)}
					</div>
				))}
			</div>
		</div>
	);
}

// Form skeleton
export function FormSkeleton() {
	return (
		<Card className="max-w-3xl">
			<CardHeader>
				<div className="flex items-center gap-2">
					<Skeleton className="h-5 w-5" />
					<Skeleton className="h-6 w-48" />
				</div>
				<Skeleton className="h-4 w-96" />
			</CardHeader>

			<CardContent className="space-y-6">
				<div className="space-y-4">
					<Skeleton className="h-5 w-32" />
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Skeleton className="h-4 w-20" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
					<div className="space-y-2">
						<Skeleton className="h-4 w-20" />
						<Skeleton className="h-10 w-full" />
					</div>
				</div>

				{/* Additional sections */}
				<div className="space-y-4 border-t pt-4">
					<Skeleton className="h-5 w-48" />
					<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
						<div className="space-y-2">
							<Skeleton className="h-4 w-24" />
							<Skeleton className="h-10 w-full" />
						</div>
						<div className="space-y-2">
							<Skeleton className="h-4 w-16" />
							<Skeleton className="h-10 w-full" />
						</div>
					</div>
				</div>

				{/* Form actions */}
				<div className="flex justify-end gap-4 border-t pt-6">
					<Skeleton className="h-10 w-20" />
					<Skeleton className="h-10 w-32" />
				</div>
			</CardContent>
		</Card>
	);
}
