import type * as React from "react";
import { Link } from "@tanstack/react-router";
import { useAuth } from "@/contexts";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ModeToggle } from "@/components/mode-toggle";
import type { StaffRole } from "@/common/types";

interface DashboardSection {
	title: string;
	description: string;
	value: string;
	roles: Array<StaffRole>;
}

interface QuickAction {
	title: string;
	description: string;
	roles: Array<StaffRole>;
	href?: string;
	onClick?: () => void;
}

export function SharedDashboardLayout(): React.JSX.Element {
	const { user, logout } = useAuth();

	// Dashboard data based on role
	const getDashboardTitle = (): string => {
		switch (user?.role) {
			case "SUPER_ADMIN":
				return "Super Admin Dashboard";
			case "ADMIN":
				return "Admin Dashboard";
			case "DOCTOR":
				return "Doctor Dashboard";
			default:
				return "Dashboard";
		}
	};

	const getWelcomeMessage = (): string => {
		switch (user?.role) {
			case "DOCTOR":
				return `Welcome back, Dr. ${user.fullName}`;
			default:
				return `Welcome back, ${user?.fullName}`;
		}
	};

	// Stats sections that vary by role
	const dashboardSections: Array<DashboardSection> = [
		{
			title: "Total Users",
			description: "Active system users",
			value: "2,543",
			roles: ["SUPER_ADMIN", "ADMIN"],
		},
		{
			title: "Active Doctors",
			description: "Currently active doctors",
			value: "127",
			roles: ["SUPER_ADMIN", "ADMIN"],
		},
		{
			title: "System Health",
			description: "Overall system status",
			value: "99.9%",
			roles: ["SUPER_ADMIN"],
		},
		{
			title: "Today's Appointments",
			description: "Scheduled for today",
			value: "45",
			roles: ["DOCTOR"],
		},
		{
			title: "Pending Reviews",
			description: "Medical records to review",
			value: "12",
			roles: ["DOCTOR"],
		},
		{
			title: "Monthly Patients",
			description: "Patients seen this month",
			value: "284",
			roles: ["DOCTOR"],
		},
	];

	// Quick actions that vary by role
	const quickActions: Array<QuickAction> = [
		{
			title: "Manage Admins",
			description: "Add, edit, or remove admin accounts",
			roles: ["SUPER_ADMIN"],
		},
		{
			title: "System Settings",
			description: "Configure system-wide settings",
			roles: ["SUPER_ADMIN"],
		},
		{
			title: "Manage Doctors",
			description: "Add, edit, or remove doctor accounts",
			roles: ["SUPER_ADMIN", "ADMIN"],
		},
		{
			title: "View Reports",
			description: "Generate and view system reports",
			roles: ["SUPER_ADMIN", "ADMIN"],
		},
		{
			title: "Patient Records",
			description: "View and manage patient records",
			roles: ["DOCTOR"],
		},
		{
			title: "Schedule",
			description: "Manage your appointment schedule",
			roles: ["DOCTOR"],
		},
	];

	// Filter sections and actions by current user role
	const visibleSections = dashboardSections.filter(
		(section) => user?.role && section.roles.includes(user.role)
	);

	const visibleActions = quickActions.filter(
		(action) => user?.role && action.roles.includes(user.role)
	);

	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-6xl mx-auto space-y-8">
				{/* Header */}
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-foreground">
							{getDashboardTitle()}
						</h1>
						<p className="text-muted-foreground">{getWelcomeMessage()}</p>
					</div>
					<div className="flex items-center space-x-4">
						<ModeToggle />
						<Link to="/change-password">
							<Button variant="outline">Change Password</Button>
						</Link>
						<Button
							variant="outline"
							onClick={() => {
								void logout();
							}}
						>
							Logout
						</Button>
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
					{visibleSections.map((section) => (
						<Card key={section.title}>
							<CardHeader>
								<CardTitle className="text-sm font-medium text-muted-foreground">
									{section.title}
								</CardTitle>
							</CardHeader>
							<CardContent>
								<div className="text-2xl font-bold">{section.value}</div>
								<p className="text-xs text-muted-foreground">
									{section.description}
								</p>
							</CardContent>
						</Card>
					))}
				</div>

				{/* Quick Actions */}
				<div className="space-y-4">
					<h2 className="text-xl font-semibold">Quick Actions</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
						{visibleActions.map((action) => (
							<Card
								key={action.title}
								className="cursor-pointer hover:shadow-md transition-shadow"
							>
								<CardHeader>
									<CardTitle className="text-lg">{action.title}</CardTitle>
									<CardDescription>{action.description}</CardDescription>
								</CardHeader>
							</Card>
						))}
					</div>
				</div>

				{/* Role-specific Content */}
				{user?.role === "SUPER_ADMIN" && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Super Admin Tools</h2>
						<Card>
							<CardHeader>
								<CardTitle>System Administration</CardTitle>
								<CardDescription>
									Advanced system configuration and monitoring tools
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex space-x-4">
									<Button>Database Backup</Button>
									<Button variant="outline">View Logs</Button>
									<Button variant="outline">Security Audit</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{user?.role === "ADMIN" && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Administration Tools</h2>
						<Card>
							<CardHeader>
								<CardTitle>User Management</CardTitle>
								<CardDescription>
									Manage doctors and patient accounts
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex space-x-4">
									<Button>Add Doctor</Button>
									<Button variant="outline">View All Users</Button>
									<Button variant="outline">Generate Reports</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{user?.role === "DOCTOR" && (
					<div className="space-y-4">
						<h2 className="text-xl font-semibold">Medical Tools</h2>
						<Card>
							<CardHeader>
								<CardTitle>Patient Care</CardTitle>
								<CardDescription>
									Tools for patient management and medical records
								</CardDescription>
							</CardHeader>
							<CardContent>
								<div className="flex space-x-4">
									<Button>New Appointment</Button>
									<Button variant="outline">Patient Search</Button>
									<Button variant="outline">Medical Records</Button>
								</div>
							</CardContent>
						</Card>
					</div>
				)}

				{/* User Profile Section */}
				<Card>
					<CardHeader>
						<CardTitle>Your Profile</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-2 gap-4 text-sm">
							<div>
								<strong>Name:</strong> {user?.fullName}
							</div>
							<div>
								<strong>Email:</strong> {user?.email}
							</div>
							<div>
								<strong>Role:</strong> {user?.role?.replace("_", " ")}
							</div>
							<div>
								<strong>Gender:</strong> {user?.gender}
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
