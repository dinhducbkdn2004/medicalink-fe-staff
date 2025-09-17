/**
 * API Constants
 */

// Cache times
export const CACHE_TIME = {
	SHORT: 1000 * 60 * 2,
	MEDIUM: 1000 * 60 * 5,
	LONG: 1000 * 60 * 15,
	VERY_LONG: 1000 * 60 * 60,
} as const;

// Pagination defaults
export const PAGINATION_DEFAULTS = {
	PAGE: 1,
	LIMIT: 10,
	MAX_LIMIT: 100,
} as const;

export const API_ENDPOINTS = {
	AUTH: "/auth",
	ADMINS: "/admins",
	DOCTORS: "/doctors",
	SPECIALTIES: "/specialties",
	BLOGS: "/blogs",
	QUESTIONS: "/questions",
} as const;

export const REQUEST_TIMEOUT = 30000;

export const STORAGE_KEYS = {
	ACCESS_TOKEN: "access_token",
	REFRESH_TOKEN: "refresh_token",
} as const;
