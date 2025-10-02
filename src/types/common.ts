export interface ApiResponse<T = unknown> {
	success: boolean;
	data: T;
	message: string;
	statusCode?: number;
	timestamp: string;
	path: string;
	method: string;
	meta?: any;
}

export interface ApiError {
	success: false;
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
	method: string;
	error?: string;
	details?: any[];
	code?: string | number;
	requestId?: string;
}

export interface PaginationParams {
	page?: number;
	limit?: number;
	skip?: number;
	sortBy?: string;
	sortOrder?: "asc" | "desc";
}

export interface PaginatedResponse<T> {
	data: T[];
	meta: {
		page?: number;
		skip?: number;
		limit: number;
		total: number;
		totalPages?: number;
		hasNext: boolean;
		hasPrev: boolean;
	};
}

export type StaffRole = "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
export type Gender = "MALE" | "FEMALE" | "UNKNOWN";

export interface StaffAccount {
	id: string;
	fullName: string;
	email: string;
	role: StaffRole;
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
	createdAt: Date;
	updatedAt: Date;
}
