import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
	AnimatedCard,
	StaggeredContainer,
	StaggeredItem,
} from "@/components/ui/animated-card";
import { motion } from "framer-motion";
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
		blue: "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 text-blue-700 dark:from-blue-950 dark:to-blue-900 dark:border-blue-800 dark:text-blue-300",
		green:
			"bg-gradient-to-br from-green-50 to-green-100 border-green-200 text-green-700 dark:from-green-950 dark:to-green-900 dark:border-green-800 dark:text-green-300",
		purple:
			"bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 text-purple-700 dark:from-purple-950 dark:to-purple-900 dark:border-purple-800 dark:text-purple-300",
		orange:
			"bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 text-orange-700 dark:from-orange-950 dark:to-orange-900 dark:border-orange-800 dark:text-orange-300",
	};

	return (
		<AnimatedCard hover={true} className="group">
			<Card
				className={`${colorClasses[color]} border-2 transition-all duration-300 group-hover:shadow-lg group-hover:shadow-${color}-200/50`}
			>
				<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
					<div className="flex items-center space-x-2">
						<motion.div
							whileHover={{ rotate: 15, scale: 1.1 }}
							transition={{ duration: 0.2 }}
						>
							{icon}
						</motion.div>
						<CardTitle className="text-sm font-medium">{title}</CardTitle>
					</div>
				</CardHeader>
				<CardContent className="pt-0">
					<motion.div
						className="mb-1 text-2xl font-bold"
						initial={{ scale: 0.5, opacity: 0 }}
						animate={{ scale: 1, opacity: 1 }}
						transition={{ delay: 0.3, duration: 0.5, ease: "backOut" }}
					>
						{value}
					</motion.div>
					<div className="flex items-center justify-between">
						<p className="text-xs opacity-75">{description}</p>
						{trend && (
							<motion.div
								className={`flex items-center text-xs font-medium ${
									trend.isPositive ? "text-green-600" : "text-red-600"
								}`}
								initial={{ x: 10, opacity: 0 }}
								animate={{ x: 0, opacity: 1 }}
								transition={{ delay: 0.5 }}
							>
								{trend.isPositive ? (
									<ArrowUpRight className="mr-1 h-3 w-3" />
								) : (
									<ArrowDownRight className="mr-1 h-3 w-3" />
								)}
								{trend.value}%
							</motion.div>
						)}
					</div>
				</CardContent>
			</Card>
		</AnimatedCard>
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
			color: "blue" as const,
		},
		{
			title: "Active Staffs",
			value: stats.activeStaffs,
			description: "Recently created",
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
			icon: <MapPin className="h-4 w-4" />,
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
	];

	return (
		<StaggeredContainer className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
			{statCards.map((stat) => (
				<StaggeredItem key={stat.title}>
					<StatCard {...stat} />
				</StaggeredItem>
			))}
		</StaggeredContainer>
	);
};
