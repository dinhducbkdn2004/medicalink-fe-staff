/**
 * API Response & Error Types
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
 * Authentication Types
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

export interface AuthTokens {
	accessToken: string;
	refreshToken: string;
	tokenExpires: number;
}

export interface LoginRequest {
	email: string;
	password: string;
}

export interface LoginResponse {
	token: string;
	refreshToken: string;
	tokenExpires: number;
	user: StaffAccount;
}

export interface ChangePasswordRequest {
	oldPassword: string;
	newPassword: string;
}

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

/**
 * Blog Types
 */
export type BlogStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface Blog {
	id: string;
	title: string;
	slug: string;
	excerpt?: string;
	content: string;
	featuredImage?: string;
	authorId: string;
	author?: StaffAccount;
	specialtyId?: string;
	specialty?: Specialty;
	status: BlogStatus;
	publishedAt?: string;
	tags: string[];
	viewCount: number;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

export interface CreateBlogRequest {
	title: string;
	excerpt?: string;
	content: string;
	featuredImage?: string;
	specialtyId?: string;
	status?: BlogStatus;
	tags?: string[];
}

export interface UpdateBlogRequest {
	title?: string;
	slug?: string;
	excerpt?: string;
	content?: string;
	featuredImage?: string;
	specialtyId?: string;
	status?: BlogStatus;
	tags?: string[];
	isActive?: boolean;
}

/**
 * Question Types
 */
export type QuestionStatus = "PENDING" | "ANSWERED" | "CLOSED";
export type QuestionPriority = "LOW" | "NORMAL" | "HIGH" | "URGENT";

export interface Question {
	id: string;
	title: string;
	content: string;
	askerName: string;
	askerEmail: string;
	status: QuestionStatus;
	priority: QuestionPriority;
	specialtyId?: string;
	specialty?: Specialty;
	doctorId?: string;
	doctor?: Doctor;
	answer?: string;
	answeredAt?: string;
	isPublic: boolean;
	viewCount: number;
	createdAt: string;
	updatedAt: string;
}

export interface CreateQuestionRequest {
	title: string;
	content: string;
	askerName: string;
	askerEmail: string;
	specialtyId?: string;
	priority?: QuestionPriority;
}

export interface UpdateQuestionRequest {
	title?: string;
	content?: string;
	status?: QuestionStatus;
	priority?: QuestionPriority;
	specialtyId?: string;
	doctorId?: string;
	answer?: string;
	isPublic?: boolean;
}

export interface AnswerQuestionRequest {
	answer: string;
	isPublic?: boolean;
}
