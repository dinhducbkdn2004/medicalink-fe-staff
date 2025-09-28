"use client";

import * as React from "react";
import {
	Activity,
	Building2,
	Command,
	FileText,
	GalleryVerticalEnd,
	MessageCircleQuestion,
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
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { getNavigationForRole, getProjectsForRole } from "@/lib/permissions";
import type { StaffRole } from "@/types/common";

// Icons mapping for navigation items
const NAVIGATION_ICONS = {
	Dashboard: SquareTerminal,
	"User Management": Users,
	"Hospital Setup": Building2,
};

// Icons mapping for project items
const PROJECT_ICONS = {
	"Content Management": FileText,
	"Q&A Management": MessageCircleQuestion,
	"Reviews & Feedback": Star,
};

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
	readonly userRole?: StaffRole;
}

export function AppSidebar({ userRole, ...props }: AppSidebarProps) {
	const { user } = useAuthStatus();

	const effectiveRole = userRole || user?.role;

	const navigation = React.useMemo(() => {
		if (!effectiveRole) return [];

		const navItems = getNavigationForRole(effectiveRole);

		return navItems.map((item) => ({
			...item,
			icon:
				NAVIGATION_ICONS[item.title as keyof typeof NAVIGATION_ICONS] ||
				SquareTerminal,
		}));
	}, [effectiveRole]);

	const projects = React.useMemo(() => {
		if (!effectiveRole) return [];

		const projectItems = getProjectsForRole(effectiveRole);

		return projectItems.map((item) => ({
			...item,
			icon: PROJECT_ICONS[item.name as keyof typeof PROJECT_ICONS] || FileText,
		}));
	}, [effectiveRole]);

	const teams = React.useMemo(() => {
		const roleLabels = {
			SUPER_ADMIN: "Super Admin",
			ADMIN: "Admin",
			DOCTOR: "Doctor",
		};

		const baseTeams = [
			{
				name: "MediCaLink Hospital",
				logo: GalleryVerticalEnd,
				plan: effectiveRole ? roleLabels[effectiveRole] : "Staff",
			},
		];

		if (effectiveRole === "SUPER_ADMIN") {
			return [
				...baseTeams,
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
			];
		}

		if (effectiveRole === "ADMIN") {
			return [
				...baseTeams,
				{
					name: "Admin Panel",
					logo: Activity,
					plan: "Management",
				},
			];
		}

		return baseTeams;
	}, [effectiveRole]);

	return (
		<Sidebar collapsible="icon" {...props}>
			<SidebarHeader>
				<TeamSwitcher teams={teams} />
			</SidebarHeader>
			<SidebarContent>
				<NavMain items={navigation} />
				{projects.length > 0 && <NavProjects projects={projects} />}
			</SidebarContent>
			<SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
			<SidebarRail />
		</Sidebar>
	);
}
