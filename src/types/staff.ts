import type { StaffAccount } from "./common";

export interface CreateStaffRequest {
	fullName: string;
	email: string;
	password: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | null;
	locationId?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
}

export interface UpdateStaffRequest {
	fullName?: string;
	email?: string;
	password?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | null;
	locationId?: string | null;
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
	phone?: string;
	specialtyId?: string;
	locationId?: string;
	experience?: number;
	qualification?: string;
	consultationFee?: number;
	isMale?: boolean;
	dateOfBirth?: Date | null;
}

export interface UpdateDoctorRequest {
	fullName?: string;
	email?: string;
	phone?: string;
	specialtyId?: string;
	locationId?: string;
	experience?: number;
	qualification?: string;
	consultationFee?: number;
	isMale?: boolean;
	dateOfBirth?: Date | null;
	isActive?: boolean;
	isAvailable?: boolean;
}

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
export interface WorkLocation {
	id: string;
	name: string;
	address?: string;
	phone?: string;
	timezone: string;
	isActive?: boolean;
	createdAt?: string;
	updatedAt?: string;
}

export interface CreateWorkLocationRequest {
	name: string;
	address?: string;
	phone?: string;
	timezone: string;
}

export interface UpdateWorkLocationRequest {
	name?: string;
	address?: string;
	phone?: string;
	timezone?: string;
	isActive?: boolean;
}
