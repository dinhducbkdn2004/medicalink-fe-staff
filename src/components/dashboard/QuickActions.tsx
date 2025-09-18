import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	Users,
	Stethoscope,
	FileText,
	MessageSquare,
	MapPin,
	Settings,
	ArrowRight,
} from "lucide-react";

interface QuickAction {
	id: string;
	title: string;
	description: string;
	icon: React.ReactNode;
	color: string;
	href?: string;
	onClick?: () => void;
}

interface QuickActionsProps {
	onActionClick?: (actionId: string) => void;
}

export const QuickActions = ({ onActionClick }: QuickActionsProps) => {
	const actions: QuickAction[] = [
		{
			id: "manage-admins",
			title: "Manage Admins",
			description: "View, add, edit, delete admin accounts",
			icon: <Users className="h-5 w-5" />,
			color: "bg-blue-500 hover:bg-blue-600",
			onClick: () => onActionClick?.("manage-admins"),
		},
		{
			id: "manage-doctors",
			title: "Manage Doctors",
			description: "View, add, edit, delete doctor accounts",
			icon: <Stethoscope className="h-5 w-5" />,
			color: "bg-green-500 hover:bg-green-600",
			onClick: () => onActionClick?.("manage-doctors"),
		},
		{
			id: "manage-blogs",
			title: "Manage Blogs",
			description: "View, add, edit, delete blog posts",
			icon: <FileText className="h-5 w-5" />,
			color: "bg-purple-500 hover:bg-purple-600",
			onClick: () => onActionClick?.("manage-blogs"),
		},
		{
			id: "manage-locations",
			title: "Manage Locations",
			description: "View, add, edit, delete locations",
			icon: <MapPin className="h-5 w-5" />,
			color: "bg-orange-500 hover:bg-orange-600",
			onClick: () => onActionClick?.("manage-locations"),
		},
		{
			id: "manage-specialties",
			title: "Manage Specialties",
			description: "View, add, edit, delete specialties",
			icon: <Settings className="h-5 w-5" />,
			color: "bg-indigo-500 hover:bg-indigo-600",
			onClick: () => onActionClick?.("manage-specialties"),
		},
		{
			id: "manage-questions",
			title: "Manage Q&A",
			description: "View and delete inappropriate questions",
			icon: <MessageSquare className="h-5 w-5" />,
			color: "bg-teal-500 hover:bg-teal-600",
			onClick: () => onActionClick?.("manage-questions"),
		},
	];

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<ArrowRight className="h-4 w-4" />
					Quick Actions
				</CardTitle>
				<CardDescription className="text-sm">
					Common tasks for system management
				</CardDescription>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="grid grid-cols-2 gap-2 lg:grid-cols-3">
					{actions.map((action) => (
						<Button
							key={action.id}
							variant="outline"
							className="flex h-auto flex-col items-start gap-2 p-3 transition-all duration-200 hover:scale-[1.02] hover:shadow-md"
							onClick={action.onClick}
						>
							<div className={`rounded-lg p-1.5 text-white ${action.color}`}>
								{action.icon}
							</div>
							<div className="w-full text-left">
								<h3 className="text-xs leading-tight font-medium">
									{action.title}
								</h3>
								<p className="text-muted-foreground mt-1 line-clamp-2 text-xs">
									{action.description}
								</p>
							</div>
						</Button>
					))}
				</div>
			</CardContent>
		</Card>
	);
};
