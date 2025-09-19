export * from "./api";

// App metadata
export const APP_NAME = "Medical Link Staff Portal";
export const APP_VERSION = "1.0.0";

// UI Constants
export const BREAKPOINTS = {
	sm: 640,
	md: 768,
	lg: 1024,
	xl: 1280,
	"2xl": 1536,
} as const;

// Role permissions
export const ROLE_PERMISSIONS = {
	SUPER_ADMIN: ["*"],
	ADMIN: [
		"read:doctors",
		"create:doctors",
		"update:doctors",
		"delete:doctors",
		"read:blogs",
		"create:blogs",
		"update:blogs",
		"delete:blogs",
		"read:specialties",
		"create:specialties",
		"update:specialties",
		"delete:specialties",
		"read:locations",
		"create:locations",
		"update:locations",
		"delete:locations",
	],
	DOCTOR: [
		"read:profile",
		"update:profile",
		"read:patients",
		"read:appointments",
		"update:appointments",
		"read:questions",
		"create:answers",
		"update:answers",
	],
} as const;

// Form validation constants
export const VALIDATION = {
	PASSWORD_MIN_LENGTH: 8,
	NAME_MIN_LENGTH: 3,
	NAME_MAX_LENGTH: 50,
	EMAIL_MAX_LENGTH: 100,
	PHONE_PATTERN: /^(\+84|0)[0-9]{9,10}$/,
	EMAIL_PATTERN: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
} as const;
