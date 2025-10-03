import type { StaffAccount } from "../common";

export type Doctor = StaffAccount;

export interface DoctorProfile {
	id: string;
	doctorId: string;
	bio?: string;
	specialtyId?: string;
	qualification?: string;
	experience?: number;
	consultationFee?: number;
	workLocationId?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface DoctorComplete extends Doctor {
	profile?: DoctorProfile;
}

export interface CreateDoctorRequest {
	name: string; // Changed from fullName to match API docs
	email: string;
	password: string;
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
	specialtyId?: string;
	workLocationId?: string;
}

export interface UpdateDoctorRequest {
	fullName?: string;
	email?: string;
	specialty?: string;
	qualification?: string;
	experience?: number;
	consultationFee?: number;
	workLocation?: string;
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
	isActive?: boolean;
	isAvailable?: boolean;
}

export interface UpdateDoctorProfileRequest {
	bio?: string;
	specialtyId?: string;
	qualification?: string;
	experience?: number;
	consultationFee?: number;
	workLocationId?: string;
}

export interface DoctorQueryParams {
	page?: number;
	limit?: number;
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "ASC" | "DESC";
}

export interface DoctorProfileQueryParams {
	page?: number;
	limit?: number;
	specialtyId?: string;
	workLocationId?: string;
}

export interface DoctorStats {
	total: number;
	recentlyCreated: number;
	active?: number;
	inactive?: number;
	bySpecialty?: Record<string, number>;
}
