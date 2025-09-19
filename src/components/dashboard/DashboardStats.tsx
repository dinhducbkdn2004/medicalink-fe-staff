import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	UserCheck,
	Stethoscope,
	FileText,
	ArrowUpRight,
	ArrowDownRight,
} from "lucide-react";

interface StatCardProps {
	title: string;
	value: string | number;
	description: string;
	icon: React.ReactNode;
	trend?: {
		value: number;
		isPositive: boolean;
	};
	color?: "blue" | "green" | "purple" | "orange";
}

const StatCard = ({
	title,
	value,
	description,
	icon,
	trend,
	color = "blue",
}: StatCardProps) => {
	const colorClasses = {
		blue: "bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950 dark:border-blue-800 dark:text-blue-300",
		green:
			"bg-green-50 border-green-200 text-green-700 dark:bg-green-950 dark:border-green-800 dark:text-green-300",
		purple:
			"bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950 dark:border-purple-800 dark:text-purple-300",
		orange:
			"bg-orange-50 border-orange-200 text-orange-700 dark:bg-orange-950 dark:border-orange-800 dark:text-orange-300",
	};

	return (
		<Card
			className={`${colorClasses[color]} transition-all duration-200 hover:scale-[1.02] hover:shadow-md`}
		>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="text-sm font-medium">{title}</CardTitle>
				<div className="h-6 w-6 rounded-full bg-white/50 p-1">{icon}</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="text-xl font-bold">{value}</div>
				<div className="mt-1 flex items-center justify-between">
					<p className="text-xs opacity-75">{description}</p>
					{trend && (
						<div
							className={`flex items-center text-xs font-medium ${
								trend.isPositive ? "text-green-600" : "text-red-600"
							}`}
						>
							{trend.isPositive ? (
								<ArrowUpRight className="mr-1 h-3 w-3" />
							) : (
								<ArrowDownRight className="mr-1 h-3 w-3" />
							)}
							{trend.value}%
						</div>
					)}
				</div>
			</CardContent>
		</Card>
	);
};

interface DashboardStatsProps {
	stats: {
		totalStaffs: number;
		activeStaffs: number;
		totalDoctors: number;
		totalLocations: number;
		totalSpecialties: number;
		totalBlogs: number;
		totalQuestions: number;
		systemHealth: number;
	};
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
	const statCards = [
		{
			title: "Total Staffs",
			value: stats.totalStaffs,
			description: "System administrators",
			icon: <Users className="h-4 w-4" />,
			trend: { value: 12, isPositive: true },
			color: "blue" as const,
		},
		{
			title: "Active Staffs",
			value: stats.activeStaffs,
			description: "Currently online",
			icon: <UserCheck className="h-4 w-4" />,
			trend: { value: 8, isPositive: true },
			color: "green" as const,
		},
		{
			title: "Total Doctors",
			value: stats.totalDoctors,
			description: "Registered doctors",
			icon: <Stethoscope className="h-4 w-4" />,
			trend: { value: 15, isPositive: true },
			color: "purple" as const,
		},
		{
			title: "Locations",
			value: stats.totalLocations,
			description: "Medical facilities",
			icon: <FileText className="h-4 w-4" />,
			trend: { value: 3, isPositive: true },
			color: "orange" as const,
		},
		{
			title: "Specialties",
			value: stats.totalSpecialties,
			description: "Medical specialties",
			icon: <FileText className="h-4 w-4" />,
			trend: { value: 5, isPositive: true },
			color: "blue" as const,
		},
		{
			title: "Blog Posts",
			value: stats.totalBlogs,
			description: "Published content",
			icon: <FileText className="h-4 w-4" />,
			trend: { value: 8, isPositive: true },
			color: "green" as const,
		},
	];

	return (
		<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
			{statCards.map((stat) => (
				<StatCard key={stat.title} {...stat} />
			))}
		</div>
	);
};
