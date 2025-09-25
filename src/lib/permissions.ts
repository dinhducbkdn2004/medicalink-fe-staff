import type { StaffRole } from "@/types/common";

// Define permission categories
export enum Permission {
	// Super Admin only permissions
	MANAGE_ADMINS = "manage_admins",
	SYSTEM_SETTINGS = "system_settings",
	DATABASE_BACKUP = "database_backup",
	VIEW_SYSTEM_LOGS = "view_system_logs",
	SECURITY_AUDIT = "security_audit",

	// Admin and Super Admin permissions
	MANAGE_DOCTORS = "manage_doctors",
	MANAGE_SPECIALTIES = "manage_specialties",
	MANAGE_LOCATIONS = "manage_locations",
	MANAGE_BLOGS = "manage_blogs",
	MANAGE_QA = "manage_qa",
	VIEW_REPORTS = "view_reports",
	MANAGE_SCHEDULES = "manage_schedules",
	MANAGE_APPOINTMENTS = "manage_appointments",

	// Common permissions
	VIEW_DASHBOARD = "view_dashboard",
	UPDATE_PROFILE = "update_profile",
	CHANGE_PASSWORD = "change_password",
}

// Role-based permission mapping
const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
	SUPER_ADMIN: [
		// All permissions
		Permission.MANAGE_ADMINS,
		Permission.SYSTEM_SETTINGS,
		Permission.DATABASE_BACKUP,
		Permission.VIEW_SYSTEM_LOGS,
		Permission.SECURITY_AUDIT,
		Permission.MANAGE_DOCTORS,
		Permission.MANAGE_SPECIALTIES,
		Permission.MANAGE_LOCATIONS,
		Permission.MANAGE_BLOGS,
		Permission.MANAGE_QA,
		Permission.VIEW_REPORTS,
		Permission.MANAGE_SCHEDULES,
		Permission.MANAGE_APPOINTMENTS,
		Permission.VIEW_DASHBOARD,
		Permission.UPDATE_PROFILE,
		Permission.CHANGE_PASSWORD,
	],
	ADMIN: [
		// Admin specific permissions (no admin management or system settings)
		Permission.MANAGE_DOCTORS,
		Permission.MANAGE_SPECIALTIES,
		Permission.MANAGE_LOCATIONS,
		Permission.MANAGE_BLOGS,
		Permission.MANAGE_QA,
		Permission.VIEW_REPORTS,
		Permission.MANAGE_SCHEDULES,
		Permission.MANAGE_APPOINTMENTS,
		Permission.VIEW_DASHBOARD,
		Permission.UPDATE_PROFILE,
		Permission.CHANGE_PASSWORD,
	],
	DOCTOR: [
		// Doctor specific permissions
		Permission.VIEW_DASHBOARD,
		Permission.UPDATE_PROFILE,
		Permission.CHANGE_PASSWORD,
		// Doctor-specific permissions would be added here
	],
};

// Navigation items configuration
export interface NavigationItem {
	title: string;
	url: string;
	icon?: any;
	isActive?: boolean;
	items?: NavigationSubItem[];
	requiredPermissions: Permission[];
}

export interface NavigationSubItem {
	title: string;
	url: string;
	requiredPermissions: Permission[];
}

// Navigation configuration for admin roles
export const ADMIN_NAVIGATION: NavigationItem[] = [
	{
		title: "Dashboard",
		url: "/admin/dashboard",
		isActive: true,
		requiredPermissions: [Permission.VIEW_DASHBOARD],
		items: [
			{
				title: "Overview",
				url: "/admin/dashboard",
				requiredPermissions: [Permission.VIEW_DASHBOARD],
			},
			{
				title: "Reports",
				url: "/admin/reports",
				requiredPermissions: [Permission.VIEW_REPORTS],
			},
		],
	},
	{
		title: "User Management",
		url: "/admin/users",
		requiredPermissions: [Permission.MANAGE_DOCTORS],
		items: [
			{
				title: "Doctor Accounts",
				url: "/admin/doctor-accounts",
				requiredPermissions: [Permission.MANAGE_DOCTORS],
			},
		],
	},
	{
		title: "Hospital Setup",
		url: "/admin/hospital",
		requiredPermissions: [
			Permission.MANAGE_SPECIALTIES,
			Permission.MANAGE_LOCATIONS,
		],
		items: [
			{
				title: "Specialties",
				url: "/admin/specialties",
				requiredPermissions: [Permission.MANAGE_SPECIALTIES],
			},
			{
				title: "Work Locations",
				url: "/admin/work-locations",
				requiredPermissions: [Permission.MANAGE_LOCATIONS],
			},
			{
				title: "Schedules",
				url: "/admin/schedules",
				requiredPermissions: [Permission.MANAGE_SCHEDULES],
			},
			{
				title: "Appointments",
				url: "/admin/appointments",
				requiredPermissions: [Permission.MANAGE_APPOINTMENTS],
			},
		],
	},
];

// Navigation configuration for super admin (extends admin navigation)
export const SUPER_ADMIN_NAVIGATION: NavigationItem[] = [
	{
		title: "Dashboard",
		url: "/super-admin/dashboard",
		isActive: true,
		requiredPermissions: [Permission.VIEW_DASHBOARD],
		items: [
			{
				title: "Overview",
				url: "/super-admin/dashboard",
				requiredPermissions: [Permission.VIEW_DASHBOARD],
			},
			{
				title: "Analytics",
				url: "/super-admin/analytics",
				requiredPermissions: [Permission.VIEW_REPORTS],
			},
			{
				title: "Reports",
				url: "/super-admin/reports",
				requiredPermissions: [Permission.VIEW_REPORTS],
			},
		],
	},
	{
		title: "User Management",
		url: "/super-admin/users",
		requiredPermissions: [Permission.MANAGE_ADMINS, Permission.MANAGE_DOCTORS],
		items: [
			{
				title: "Admin Accounts",
				url: "/super-admin/admin-accounts",
				requiredPermissions: [Permission.MANAGE_ADMINS],
			},
			{
				title: "Doctor Accounts",
				url: "/super-admin/doctor-accounts",
				requiredPermissions: [Permission.MANAGE_DOCTORS],
			},
			{
				title: "Permissions",
				url: "/super-admin/permissions",
				requiredPermissions: [Permission.MANAGE_ADMINS],
			},
		],
	},
	{
		title: "Hospital Setup",
		url: "/super-admin/hospital",
		requiredPermissions: [
			Permission.MANAGE_SPECIALTIES,
			Permission.MANAGE_LOCATIONS,
		],
		items: [
			{
				title: "Specialties",
				url: "/super-admin/specialties",
				requiredPermissions: [Permission.MANAGE_SPECIALTIES],
			},
			{
				title: "Work Locations",
				url: "/super-admin/work-locations",
				requiredPermissions: [Permission.MANAGE_LOCATIONS],
			},
			{
				title: "Schedules",
				url: "/super-admin/schedules",
				requiredPermissions: [Permission.MANAGE_SCHEDULES],
			},
			{
				title: "Appointments",
				url: "/super-admin/appointments",
				requiredPermissions: [Permission.MANAGE_APPOINTMENTS],
			},
		],
	},
	{
		title: "System Settings",
		url: "/super-admin/settings",
		requiredPermissions: [Permission.SYSTEM_SETTINGS],
		items: [
			{
				title: "General",
				url: "/super-admin/settings/general",
				requiredPermissions: [Permission.SYSTEM_SETTINGS],
			},
			{
				title: "Security",
				url: "/super-admin/settings/security",
				requiredPermissions: [Permission.SECURITY_AUDIT],
			},
			{
				title: "Backup",
				url: "/super-admin/settings/backup",
				requiredPermissions: [Permission.DATABASE_BACKUP],
			},
			{
				title: "Logs",
				url: "/super-admin/settings/logs",
				requiredPermissions: [Permission.VIEW_SYSTEM_LOGS],
			},
		],
	},
];

// Utility functions
export const hasPermission = (
	userRole: StaffRole,
	permission: Permission
): boolean => {
	const rolePermissions = ROLE_PERMISSIONS[userRole];
	return rolePermissions.includes(permission);
};

export const hasAnyPermission = (
	userRole: StaffRole,
	permissions: Permission[]
): boolean => {
	return permissions.some((permission) => hasPermission(userRole, permission));
};

export const hasAllPermissions = (
	userRole: StaffRole,
	permissions: Permission[]
): boolean => {
	return permissions.every((permission) => hasPermission(userRole, permission));
};

export const filterNavigationByPermissions = (
	navigation: NavigationItem[],
	userRole: StaffRole
): NavigationItem[] => {
	return navigation.filter((item) => {
		// Check if user has any of the required permissions for the main item
		const hasMainPermission = hasAnyPermission(
			userRole,
			item.requiredPermissions
		);

		if (!hasMainPermission) {
			return false;
		}

		// Filter sub-items based on permissions
		if (item.items) {
			item.items = item.items.filter((subItem) =>
				hasAnyPermission(userRole, subItem.requiredPermissions)
			);
		}

		return true;
	});
};

export const getNavigationForRole = (userRole: StaffRole): NavigationItem[] => {
	switch (userRole) {
		case "SUPER_ADMIN":
			return filterNavigationByPermissions(SUPER_ADMIN_NAVIGATION, userRole);
		case "ADMIN":
			return filterNavigationByPermissions(ADMIN_NAVIGATION, userRole);
		default:
			return [];
	}
};

// Project items (content management)
export interface ProjectItem {
	name: string;
	url: string;
	icon?: any;
	requiredPermissions: Permission[];
}

export const PROJECT_ITEMS: ProjectItem[] = [
	{
		name: "Content Management",
		url: "/admin/content",
		requiredPermissions: [Permission.MANAGE_BLOGS],
	},
	{
		name: "Q&A Management",
		url: "/admin/qa",
		requiredPermissions: [Permission.MANAGE_QA],
	},
];

export const getProjectsForRole = (userRole: StaffRole): ProjectItem[] => {
	return PROJECT_ITEMS.filter((project) =>
		hasAnyPermission(userRole, project.requiredPermissions)
	);
};
