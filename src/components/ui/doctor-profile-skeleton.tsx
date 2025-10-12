import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function DoctorProfileSkeleton() {
	return (
		<div className="min-h-screen">
			{/* Header Skeleton */}
			<div className="bg-background shadow-sm">
				<div className="container mx-auto max-w-6xl px-6 py-3">
					<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
						<div className="flex flex-wrap items-center gap-2">
							<Skeleton className="h-8 w-32" />
							<Skeleton className="h-8 w-24" />
						</div>
						<div className="flex items-center gap-2">
							<Skeleton className="h-8 w-20" />
							<Skeleton className="h-8 w-28" />
						</div>
					</div>
				</div>
			</div>

			{/* Main Content Skeleton */}
			<div className="container mx-auto max-w-6xl px-6 py-6">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					{/* Left Column - Profile Header & Contact */}
					<div className="space-y-4 lg:col-span-4">
						{/* Profile Header Card */}
						<Card>
							<CardContent className="p-4">
								<div className="mb-4 flex items-start justify-between">
									<Skeleton className="h-16 w-16 rounded-full" />
									<Skeleton className="h-8 w-20" />
								</div>
								<div className="space-y-2">
									<Skeleton className="h-5 w-32" />
									<Skeleton className="h-4 w-24" />
									<div className="flex flex-wrap items-center gap-2">
										<Skeleton className="h-6 w-20" />
										<Skeleton className="h-6 w-16" />
									</div>
									<Skeleton className="h-4 w-28" />
									<div className="grid grid-cols-3 gap-3 border-t pt-3">
										<div className="text-center">
											<Skeleton className="mx-auto h-4 w-6" />
											<Skeleton className="mx-auto mt-1 h-3 w-16" />
										</div>
										<div className="text-center">
											<Skeleton className="mx-auto h-4 w-6" />
											<Skeleton className="mx-auto mt-1 h-3 w-16" />
										</div>
										<div className="text-center">
											<Skeleton className="mx-auto h-4 w-6" />
											<Skeleton className="mx-auto mt-1 h-3 w-16" />
										</div>
									</div>
								</div>
							</CardContent>
						</Card>

						{/* Contact Information Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-5 w-32" />
								</div>
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent className="space-y-6">
								{Array.from({ length: 4 }, (_, i) => (
									<div key={i}>
										<div className="mb-1.5 flex items-center gap-2">
											<Skeleton className="h-4 w-4" />
											<Skeleton className="h-4 w-20" />
										</div>
										<Skeleton className="h-10 w-full rounded-lg" />
									</div>
								))}
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Professional Info */}
					<div className="space-y-4 lg:col-span-8">
						{/* Professional Information Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-5 w-40" />
								</div>
								<Skeleton className="h-4 w-64" />
							</CardHeader>
							<CardContent className="space-y-6">
								{Array.from({ length: 3 }, (_, i) => (
									<div key={i} className="space-y-3">
										<div className="flex items-center gap-2">
											<Skeleton className="h-4 w-4" />
											<Skeleton className="h-4 w-32" />
										</div>
										<Skeleton className="h-12 w-full rounded-lg" />
									</div>
								))}
							</CardContent>
						</Card>

						{/* Introduction Card */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-5 w-24" />
								</div>
							</CardHeader>
							<CardContent>
								<div className="space-y-2">
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-3/4" />
									<Skeleton className="h-4 w-full" />
									<Skeleton className="h-4 w-2/3" />
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

// Compact skeleton for smaller areas
export function DoctorProfileCompactSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-24" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
