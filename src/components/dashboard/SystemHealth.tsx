import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
	Server,
	Wifi,
	Shield,
	Activity,
	CheckCircle,
	AlertTriangle,
	XCircle,
	Users,
} from "lucide-react";

// Simple Progress component
const Progress = ({
	value,
	className,
}: {
	value: number;
	className?: string;
}) => {
	return (
		<div className={`h-2 w-full rounded-full bg-gray-200 ${className}`}>
			<div
				className="h-2 rounded-full bg-blue-600 transition-all duration-300"
				style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
			></div>
		</div>
	);
};

interface SystemMetric {
	label: string;
	value: number;
	max: number;
	unit: string;
	status: "good" | "warning" | "critical";
}

interface SystemHealthProps {
	metrics: {
		serverUptime: number;
		databaseConnections: SystemMetric;
		diskUsage: SystemMetric;
		memoryUsage: SystemMetric;
		cpuUsage: SystemMetric;
		networkLatency: number;
		activeUsers: number;
		totalRequests: number;
		errorRate: number;
	};
}

const getStatusColor = (status: SystemMetric["status"]) => {
	switch (status) {
		case "good":
			return "text-green-600 bg-green-100";
		case "warning":
			return "text-yellow-600 bg-yellow-100";
		case "critical":
			return "text-red-600 bg-red-100";
	}
};

const getStatusIcon = (status: SystemMetric["status"]) => {
	switch (status) {
		case "good":
			return <CheckCircle className="h-4 w-4" />;
		case "warning":
			return <AlertTriangle className="h-4 w-4" />;
		case "critical":
			return <XCircle className="h-4 w-4" />;
	}
};

const MetricCard = ({ metric }: { metric: SystemMetric }) => {
	const percentage = (metric.value / metric.max) * 100;

	return (
		<div className="space-y-2">
			<div className="flex items-center justify-between">
				<span className="text-sm font-medium">{metric.label}</span>
				<div
					className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs ${getStatusColor(metric.status)}`}
				>
					{getStatusIcon(metric.status)}
					{metric.status === "good"
						? "Good"
						: metric.status === "warning"
							? "Warning"
							: "Critical"}
				</div>
			</div>
			<div className="flex items-center justify-between text-sm">
				<span>
					{metric.value}
					{metric.unit}
				</span>
				<span className="text-muted-foreground">
					/ {metric.max}
					{metric.unit}
				</span>
			</div>
			<Progress value={percentage} className="h-2" />
		</div>
	);
};

export const SystemHealth = ({ metrics }: SystemHealthProps) => {
	const formatUptime = (seconds: number) => {
		const days = Math.floor(seconds / 86400);
		const hours = Math.floor((seconds % 86400) / 3600);
		const minutes = Math.floor((seconds % 3600) / 60);

		if (days > 0) return `${days}d ${hours}h ${minutes}m`;
		if (hours > 0) return `${hours}h ${minutes}m`;
		return `${minutes}m`;
	};

	const getOverallStatus = () => {
		const criticalMetrics = [
			metrics.databaseConnections,
			metrics.diskUsage,
			metrics.memoryUsage,
			metrics.cpuUsage,
		].filter((m) => m.status === "critical");

		const warningMetrics = [
			metrics.databaseConnections,
			metrics.diskUsage,
			metrics.memoryUsage,
			metrics.cpuUsage,
		].filter((m) => m.status === "warning");

		if (criticalMetrics.length > 0)
			return { status: "critical", label: "Critical" };
		if (warningMetrics.length > 0)
			return { status: "warning", label: "Needs Attention" };
		return { status: "good", label: "Operating Well" };
	};

	const overallStatus = getOverallStatus();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Server className="h-5 w-5" />
					System Health
				</CardTitle>
				<CardDescription>Monitor system performance and status</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Overall Status */}
				<div className="bg-muted/50 flex items-center justify-between rounded-lg p-4">
					<div className="flex items-center gap-3">
						<div
							className={`rounded-full p-2 ${
								overallStatus.status === "good"
									? "bg-green-100"
									: overallStatus.status === "warning"
										? "bg-yellow-100"
										: "bg-red-100"
							}`}
						>
							{overallStatus.status === "good" ? (
								<CheckCircle className="h-5 w-5 text-green-600" />
							) : overallStatus.status === "warning" ? (
								<AlertTriangle className="h-5 w-5 text-yellow-600" />
							) : (
								<XCircle className="h-5 w-5 text-red-600" />
							)}
						</div>
						<div>
							<h3 className="font-medium">Overall Status</h3>
							<p className="text-muted-foreground text-sm">
								{overallStatus.label}
							</p>
						</div>
					</div>
					<Badge
						variant={
							overallStatus.status === "good" ? "default" : "destructive"
						}
					>
						{overallStatus.label}
					</Badge>
				</div>

				{/* System Metrics */}
				<div className="grid gap-4 md:grid-cols-2">
					<MetricCard metric={metrics.cpuUsage} />
					<MetricCard metric={metrics.memoryUsage} />
					<MetricCard metric={metrics.diskUsage} />
					<MetricCard metric={metrics.databaseConnections} />
				</div>

				{/* Additional Info */}
				<div className="grid gap-4 border-t pt-4 md:grid-cols-3">
					<div className="text-center">
						<div className="mb-1 flex items-center justify-center gap-2">
							<Activity className="h-4 w-4 text-blue-600" />
							<span className="text-sm font-medium">Uptime</span>
						</div>
						<p className="text-lg font-bold">
							{formatUptime(metrics.serverUptime)}
						</p>
					</div>

					<div className="text-center">
						<div className="mb-1 flex items-center justify-center gap-2">
							<Wifi className="h-4 w-4 text-green-600" />
							<span className="text-sm font-medium">Network Latency</span>
						</div>
						<p className="text-lg font-bold">{metrics.networkLatency}ms</p>
					</div>

					<div className="text-center">
						<div className="mb-1 flex items-center justify-center gap-2">
							<Users className="h-4 w-4 text-purple-600" />
							<span className="text-sm font-medium">Active Users</span>
						</div>
						<p className="text-lg font-bold">{metrics.activeUsers}</p>
					</div>
				</div>

				{/* Performance Summary */}
				<div className="bg-muted/30 flex items-center justify-between rounded-lg p-3">
					<div className="flex items-center gap-2">
						<Shield className="h-4 w-4 text-blue-600" />
						<span className="text-sm font-medium">Performance Overview</span>
					</div>
					<div className="flex items-center gap-4 text-sm">
						<span>{metrics.totalRequests} requests</span>
						<span className="text-muted-foreground">•</span>
						<span>{metrics.errorRate}% errors</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
