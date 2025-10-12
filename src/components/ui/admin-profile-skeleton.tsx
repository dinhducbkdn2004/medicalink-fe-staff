import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function AdminProfileSkeleton() {
	return (
		<div className="flex flex-1 flex-col gap-6 p-6">
			{/* Header */}
			<div className="flex items-center justify-between">
				<Skeleton className="h-8 w-48" />
				<div className="flex gap-3">
					<Skeleton className="h-9 w-32" />
					<Skeleton className="h-9 w-28" />
				</div>
			</div>

			<div className="mx-auto w-full max-w-4xl">
				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					{/* Left Column - Profile Card */}
					<div className="lg:col-span-4">
						<Card>
							<CardContent className="flex flex-col items-center p-6">
								<Skeleton className="h-24 w-24 rounded-full" />
								<div className="mt-4 space-y-2 text-center">
									<Skeleton className="h-6 w-32" />
									<Skeleton className="h-4 w-40" />
									<Skeleton className="h-6 w-20 rounded-full" />
								</div>
								<div className="mt-4 flex items-center gap-2">
									<Skeleton className="h-4 w-4" />
									<Skeleton className="h-4 w-32" />
								</div>
							</CardContent>
						</Card>
					</div>

					{/* Right Column - Information Cards */}
					<div className="space-y-6 lg:col-span-8">
						{/* Basic Information */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-6 w-32" />
								</div>
								<Skeleton className="h-4 w-48" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{Array.from({ length: 4 }, (_, i) => (
										<div key={i}>
											<div className="mb-2 flex items-center gap-2">
												<Skeleton className="h-4 w-4" />
												<Skeleton className="h-4 w-16" />
											</div>
											<Skeleton className="h-10 w-full" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Personal Information */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-6 w-40" />
								</div>
								<Skeleton className="h-4 w-36" />
							</CardHeader>
							<CardContent className="space-y-4">
								<div className="grid grid-cols-1 gap-4 md:grid-cols-3">
									{Array.from({ length: 3 }, (_, i) => (
										<div key={i}>
											<div className="mb-2 flex items-center gap-2">
												<Skeleton className="h-4 w-4" />
												<Skeleton className="h-4 w-20" />
											</div>
											<Skeleton className="h-10 w-full" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>

						{/* Account Activity */}
						<Card>
							<CardHeader>
								<div className="flex items-center gap-2">
									<Skeleton className="h-5 w-5" />
									<Skeleton className="h-6 w-32" />
								</div>
								<Skeleton className="h-4 w-56" />
							</CardHeader>
							<CardContent>
								<div className="grid grid-cols-1 gap-4 md:grid-cols-2">
									{Array.from({ length: 2 }, (_, i) => (
										<div key={i}>
											<Skeleton className="h-4 w-24" />
											<Skeleton className="mt-1 h-4 w-32" />
										</div>
									))}
								</div>
							</CardContent>
						</Card>
					</div>
				</div>
			</div>
		</div>
	);
}

// Compact version for smaller areas
export function AdminProfileCompactSkeleton() {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex items-center gap-4">
					<Skeleton className="h-12 w-12 rounded-full" />
					<div className="space-y-2">
						<Skeleton className="h-4 w-32" />
						<Skeleton className="h-3 w-24" />
						<Skeleton className="h-5 w-16 rounded-full" />
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
