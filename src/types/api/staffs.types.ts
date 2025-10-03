import type { StaffRole } from "../common";

export interface CreateStaffRequest {
	fullName: string;
	email: string;
	password: string;
	role?: StaffRole;
	phone?: string | undefined;
	isMale?: boolean | undefined;
	dateOfBirth?: Date | null;
}

export interface UpdateStaffRequest {
	fullName?: string;
	email?: string;
	password?: string;
	role?: StaffRole;
	phone?: string | undefined;
	isMale?: boolean | undefined;
	dateOfBirth?: Date | null;
}

export interface StaffQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	role?: StaffRole;
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "ASC" | "DESC";
}

export interface StaffStats {
	total: number;
	recentlyCreated: number;
	byRole?: {
		superAdmin: number;
		admin: number;
		doctor: number;
	};
}
