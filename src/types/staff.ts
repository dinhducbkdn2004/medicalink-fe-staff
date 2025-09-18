import type { StaffAccount, Gender } from "./common";

/**
 * Admin Types
 */
export interface CreateAdminRequest {
	fullName: string;
	email: string;
	password: string;
	gender: Gender;
	dateOfBirth?: string;
	phone?: string;
	address?: string;
}

export interface UpdateAdminRequest {
	fullName?: string;
	email?: string;
	gender?: Gender;
	dateOfBirth?: string;
	phone?: string;
	address?: string;
	isActive?: boolean;
}

/**
 * Doctor Types
 */
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
 * Location Types
 */
export interface Location {
	id: string;
	name: string;
	address: string;
	city: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	email?: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateLocationRequest {
	name: string;
	address: string;
	city: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	email?: string;
}

export interface UpdateLocationRequest {
	name?: string;
	address?: string;
	city?: string;
	state?: string;
	zipCode?: string;
	phone?: string;
	email?: string;
	isActive?: boolean;
}
