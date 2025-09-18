/**
 * Common API Types
 */
export interface ApiResponse<T = unknown> {
	data: T;
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
}

export interface ApiError {
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
	error?: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page: number;
		limit: number;
		total: number;
		totalPages: number;
	};
}

/**
 * Common Types
 */
export type StaffRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
export type Gender = "MALE" | "FEMALE" | "UNKNOWN";

export interface StaffAccount {
	id: string;
	fullName: string;
	email: string;
	role: StaffRole;
	avatar?: string;
	gender: Gender;
	dateOfBirth: string | null;
	phone?: string;
	address?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}
