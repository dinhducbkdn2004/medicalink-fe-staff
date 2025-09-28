import type { StaffAccount } from "./common";

export interface CreateStaffRequest {
	fullName: string;
	email: string;
	password: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | undefined;
	isMale?: boolean | undefined;
	dateOfBirth?: Date | null;
}

export interface UpdateStaffRequest {
	fullName?: string;
	email?: string;
	password?: string;
	role?: "SUPER_ADMIN" | "ADMIN" | "DOCTOR";
	phone?: string | undefined;
	isMale?: boolean | undefined;
	dateOfBirth?: Date | null;
}

export interface Doctor extends StaffAccount {
	specialtyId?: string;
	specialty?: Specialty;
	locationId?: string;
	location?: Location;
	yearsExperience?: number;
	experience?: number; // Added for DoctorAccountsPage compatibility
	isAvailable: boolean;
	qualification?: string;
	status?: "active" | "inactive"; // Added for status filtering
	avatar?: string; // Added for avatar display
	consultationFee?: number; // Added for fee display
}

export interface CreateDoctorRequest {
	fullName: string;
	email: string;
	password: string;
	phone?: string | null;
	isMale?: boolean | null;
	dateOfBirth?: Date | null;
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

export interface Specialty {
	id: string;
	name: string;
	description?: string;
	icon?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
	infoSections?: InfoSection[];
}

export interface InfoSection {
	id: string;
	specialtyId: string;
	name: string;
	content: string;
	order?: number;
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
