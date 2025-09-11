"use client";

import * as React from "react";
import {
	Activity,
	Building2,
	Command,
	FileText,
	GalleryVerticalEnd,
	MessageCircleQuestion,
	Settings2,
	SquareTerminal,
	Star,
	Users,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavProjects } from "@/components/nav-projects";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarHeader,
	SidebarRail,
} from "@/components/ui/sidebar";
import { useAuth } from "@/contexts";

// Hospital Management System Data for Super Admin
const data = {
	teams: [
		{
			name: "MediCaLink Hospital",
			logo: GalleryVerticalEnd,
			plan: "Super Admin",
		},
		{
			name: "Admin Panel",
			logo: Activity,
			plan: "Management",
		},
		{
			name: "System Control",
			logo: Command,
			plan: "Enterprise",
		},
	],
	navMain: [
		{
			title: "Dashboard",
			url: "/super-admin/dashboard",
			icon: SquareTerminal,
			isActive: true,
			items: [
				{
					title: "Overview",
					url: "/super-admin/dashboard",
				},
				{
					title: "Analytics",
					url: "/super-admin/analytics",
				},
				{
					title: "Reports",
					url: "/super-admin/reports",
				},
			],
		},
		{
			title: "User Management",
			url: "/super-admin/users",
			icon: Users,
			items: [
				{
					title: "Admin Accounts",
					url: "/super-admin/admin-accounts",
				},
				{
					title: "Doctor Accounts",
					url: "/super-admin/doctor-accounts",
				},
				{
					title: "Patients",
					url: "/super-admin/patients",
				},
				{
					title: "Permissions",
					url: "/super-admin/permissions",
				},
			],
		},
		{
			title: "Hospital Setup",
			url: "/super-admin/hospital",
			icon: Building2,
			items: [
				{
					title: "Specialties",
					url: "/super-admin/specialties",
				},
				{
					title: "Work Locations",
					url: "/super-admin/work-locations",
				},
				{
					title: "Schedules",
					url: "/super-admin/schedules",
				},
				{
					title: "Appointments",
					url: "/super-admin/appointments",
				},
			],
		},
		{
			title: "System Settings",
			url: "/super-admin/settings",
			icon: Settings2,
			items: [
				{
					title: "General",
					url: "/super-admin/settings/general",
				},
				{
					title: "Security",
					url: "/super-admin/settings/security",
				},
				{
					title: "Backup",
					url: "/super-admin/settings/backup",
				},
				{
					title: "Logs",
					url: "/super-admin/settings/logs",
				},
			],
		},
	],
	projects: [
		{
			name: "Content Management",
			url: "/super-admin/content",
			icon: FileText,
		},
		{
			name: "Q&A Management",
			url: "/super-admin/qa",
			icon: MessageCircleQuestion,
		},
		{
			name: "Reviews & Feedback",
			url: "/super-admin/reviews",
			icon: Star,
		},
	],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
	const { user } = useAuth();

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={data.teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={data.navMain} />
				<NavProjects projects={data.projects} />
			</SidebarContent>
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
