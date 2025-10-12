import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
	UserPlus,
	UserMinus,
	FileText,
	AlertTriangle,
	CheckCircle,
	Clock,
	ArrowRight,
} from "lucide-react";

interface Activity {
	id: string;
	type:
		| "admin_created"
		| "admin_updated"
		| "admin_deleted"
		| "doctor_created"
		| "doctor_updated"
		| "doctor_deleted"
		| "blog_created"
		| "blog_updated"
		| "blog_deleted"
		| "location_created"
		| "location_updated"
		| "location_deleted"
		| "specialty_created"
		| "specialty_updated"
		| "specialty_deleted"
		| "question_deleted"
		| "system_alert";
	title: string;
	description: string;
	user?: {
		name: string;
		avatar?: string;
		role: string;
	};
	timestamp: string;
	status?: "success" | "warning" | "error" | "info";
}

interface RecentActivitiesProps {
	activities: Activity[];
	onViewAll?: () => void;
}

const formatTimeAgo = (timestamp: string) => {
	const now = new Date();
	const activityTime = new Date(timestamp);
	const diffInMinutes = Math.floor(
		(now.getTime() - activityTime.getTime()) / (1000 * 60)
	);

	if (diffInMinutes < 1) return "Just now";
	if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;

	const diffInHours = Math.floor(diffInMinutes / 60);
	if (diffInHours < 24) return `${diffInHours} hours ago`;

	const diffInDays = Math.floor(diffInHours / 24);
	return `${diffInDays} days ago`;
};

const getActivityIcon = (type: Activity["type"]) => {
	switch (type) {
		case "admin_created":
		case "admin_updated":
			return <UserPlus className="h-4 w-4 text-green-600" />;
		case "admin_deleted":
		case "doctor_deleted":
		case "blog_deleted":
		case "location_deleted":
		case "specialty_deleted":
		case "question_deleted":
			return <UserMinus className="h-4 w-4 text-red-600" />;
		case "doctor_created":
		case "doctor_updated":
			return <CheckCircle className="h-4 w-4 text-blue-600" />;
		case "blog_created":
		case "blog_updated":
			return <FileText className="h-4 w-4 text-purple-600" />;
		case "location_created":
		case "location_updated":
		case "specialty_created":
		case "specialty_updated":
			return <CheckCircle className="h-4 w-4 text-indigo-600" />;
		case "system_alert":
			return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
		default:
			return <CheckCircle className="h-4 w-4 text-gray-600" />;
	}
};

const getStatusBadge = (status?: Activity["status"]) => {
	if (!status) return null;

	const statusConfig = {
		success: { label: "Success", className: "bg-green-100 text-green-800" },
		warning: { label: "Warning", className: "bg-yellow-100 text-yellow-800" },
		error: { label: "Error", className: "bg-red-100 text-red-800" },
		info: { label: "Info", className: "bg-blue-100 text-blue-800" },
	};

	const config = statusConfig[status];
	return (
		<Badge variant="secondary" className={config.className}>
			{config.label}
		</Badge>
	);
};

export const RecentActivities = ({
	activities,
	onViewAll,
}: RecentActivitiesProps) => {
	const displayActivities = activities.slice(0, 5);

	return (
		<Card className="h-full">
			<CardHeader className="flex flex-row items-center justify-between pb-3">
				<div>
					<CardTitle className="flex items-center gap-2 text-base">
						<Clock className="h-4 w-4" />
						Recent Activities
					</CardTitle>
					<CardDescription className="text-sm">
						Important activities in the system
					</CardDescription>
				</div>
				{onViewAll && activities.length > 5 && (
					<Button variant="outline" size="sm" onClick={onViewAll}>
						View all
						<ArrowRight className="ml-2 h-3 w-3" />
					</Button>
				)}
			</CardHeader>
			<CardContent className="pt-0 overflow-y-auto">
				<div className="max-h-80 space-y-2">
					{displayActivities.length === 0 ? (
						<div className="text-muted-foreground py-8 text-center">
							<Clock className="mx-auto mb-4 h-12 w-12 opacity-50" />
							<p>No activities yet</p>
						</div>
					) : (
						displayActivities.map((activity) => (
							<div
								key={activity.id}
								className="hover:bg-muted/50 hover:border-muted flex items-start space-x-2 rounded-lg border border-transparent p-2 transition-colors"
							>
								<div className="mt-0.5 flex-shrink-0">
									{getActivityIcon(activity.type)}
								</div>

								<div className="min-w-0 flex-1">
									<div className="mb-1 flex items-center justify-between">
										<p className="text-foreground truncate text-sm font-medium">
											{activity.title}
										</p>
										<div className="flex flex-shrink-0 items-center gap-2">
											{getStatusBadge(activity.status)}
											<span className="text-muted-foreground text-xs whitespace-nowrap">
												{formatTimeAgo(activity.timestamp)}
											</span>
										</div>
									</div>

									<p className="text-muted-foreground mb-1 line-clamp-1 text-xs">
										{activity.description}
									</p>

									{activity.user && (
										<div className="flex items-center">
											<Avatar className="mr-2 h-4 w-4">
												<AvatarImage src={activity.user.avatar} />
												<AvatarFallback className="text-xs">
													{activity.user.name.charAt(0)}
												</AvatarFallback>
											</Avatar>
											<span className="text-muted-foreground truncate text-xs">
												{activity.user.name} • {activity.user.role}
											</span>
										</div>
									)}
								</div>
							</div>
						))
					)}
				</div>
			</CardContent>
		</Card>
	);
};
