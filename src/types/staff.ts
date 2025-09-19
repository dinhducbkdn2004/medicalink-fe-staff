import type { StaffAccount, Gender } from "./common";

export interface CreateStaffRequest {
	fullName: string;
	email: string;
	password: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
}

export interface UpdateStaffRequest {
	fullName?: string;
	email?: string;
	password?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
}

export interface Doctor extends StaffAccount {
	specialtyId?: string;
	specialty?: Specialty;
	locationId?: string;
	location?: Location;
	experience?: number;
	qualification?: string;
	consultationFee?: number;
	isAvailable: boolean;
}

export interface CreateDoctorRequest {
	fullName: string;
	email: string;
	password: string;
	gender: Gender;
	dateOfBirth?: string;
	phone?: string;
	address?: string;
	specialtyId?: string;
	locationId?: string;
	experience?: number;
	qualification?: string;
	consultationFee?: number;
}

export interface UpdateDoctorRequest {
	fullName?: string;
	email?: string;
	gender?: Gender;
	dateOfBirth?: string;
	phone?: string;
	address?: string;
	specialtyId?: string;
	locationId?: string;
	experience?: number;
	qualification?: string;
	consultationFee?: number;
	isActive?: boolean;
	isAvailable?: boolean;
}

/**
 * Specialty Types
 */
export interface Specialty {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateSpecialtyRequest {
	name: string;
	description?: string;
	icon?: string;
}

export interface UpdateSpecialtyRequest {
	name?: string;
	description?: string;
	icon?: string;
	isActive?: boolean;
}

/**
 * Work Location Types (updated to match backend)
 */
export interface WorkLocation {
	id: string;
	name: string;
	address?: string; // Made optional to match backend
	phone?: string;
	timezone: string; // Added to match backend
	isActive?: boolean; // Optional in backend
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateWorkLocationRequest {
	name: string;
	address?: string;
	phone?: string;
	timezone: string; // Required in backend
}

export interface UpdateWorkLocationRequest {
	name?: string;
	address?: string;
	phone?: string;
	timezone?: string;
	isActive?: boolean;
}
