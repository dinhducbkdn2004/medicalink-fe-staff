import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	Users,
	UserCheck,
	Stethoscope,
	MapPin,
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
}

const StatCard = ({
	title,
	value,
	description,
	icon,
	trend,
}: StatCardProps) => {
	return (
		<Card className="border-border bg-card border">
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<div className="flex items-center space-x-2">
					{icon}
					<CardTitle className="text-sm font-medium">{title}</CardTitle>
				</div>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="mb-1 text-2xl font-bold">{value}</div>
				<div className="flex items-center justify-between">
					<p className="text-muted-foreground text-xs">{description}</p>
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
	};
	isLoading?: boolean;
}

export const DashboardStats = ({ stats }: DashboardStatsProps) => {
	const statCards = [
		{
			title: "Total Staffs",
			value: stats.totalStaffs,
			description: "System administrators",
			icon: <Users className="h-4 w-4" />,
			trend: { value: 12, isPositive: true },
		},
		{
			title: "Active Staffs",
			value: stats.activeStaffs,
			description: "Recently created",
			icon: <UserCheck className="h-4 w-4" />,
			trend: { value: 8, isPositive: true },
		},
		{
			title: "Total Doctors",
			value: stats.totalDoctors,
			description: "Registered doctors",
			icon: <Stethoscope className="h-4 w-4" />,
			trend: { value: 15, isPositive: true },
		},
		{
			title: "Locations",
			value: stats.totalLocations,
			description: "Medical facilities",
			icon: <MapPin className="h-4 w-4" />,
			trend: { value: 3, isPositive: true },
		},
		{
			title: "Specialties",
			value: stats.totalSpecialties,
			description: "Medical specialties",
			icon: <FileText className="h-4 w-4" />,
			trend: { value: 5, isPositive: true },
		},
	];

	return (
		<div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{statCards.map((stat, index) => (
				<div key={index} className="group">
					<StatCard {...stat} />
				</div>
			))}
		</div>
	);
};
