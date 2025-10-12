import type { StaffAccount } from "../common";

export type Doctor = StaffAccount;

export interface DoctorProfile {
	id: string;
	doctorId: string;
	degree?: string;
	position?: string[];
	introduction?: string;
	memberships?: string[];
	awards?: string[];
	research?: string; // Rich text content with HTML tags
	trainingProcess?: string[];
	experience?: string[];
	avatarUrl?: string;
	portrait?: string;
	specialtyIds?: string[];
	locationIds?: string[];
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface DoctorComplete {
	id: string;
	fullName: string;
	email: string;
	phone?: string;
	isMale?: boolean;
	dateOfBirth?: string;
	role: string;
	profileId?: string;
	isActive?: boolean;
	// Profile fields (when complete profile is loaded)
	degree?: string;
	position?: string[];
	introduction?: string;
	memberships?: string[];
	awards?: string[];
	research?: string;
	trainingProcess?: string[];
	experience?: string[];
	avatarUrl?: string;
	portrait?: string;
	specialties?: Array<{
		id: string;
		name: string;
		slug: string;
		description: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
	}>;
	workLocations?: Array<{
		id: string;
		name: string;
		address: string;
		phone: string;
		timezone: string;
		isActive: boolean;
		createdAt: string;
		updatedAt: string;
	}>;
	accountCreatedAt?: string;
	accountUpdatedAt?: string;
	profileCreatedAt?: string;
	profileUpdatedAt?: string;
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

export interface UpdateDoctorProfileRequest {
	degree?: string;
	position?: string[];
	introduction?: string;
	memberships?: string[];
	awards?: string[];
	research?: string; // Rich text content with HTML tags
	trainingProcess?: string[];
	experience?: string[];
	avatarUrl?: string;
	portrait?: string;
	specialtyIds?: string[];
	locationIds?: string[];
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
	specialtyIds?: string[];
	locationIds?: string[];
	isActive?: boolean;
}

export interface DoctorStats {
	total: number;
	recentlyCreated: number;
	active?: number;
	inactive?: number;
	bySpecialty?: Record<string, number>;
}
