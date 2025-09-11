export type FunctionComponent = React.ReactElement | null;

// Authentication Types
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
	createdAt: string;
	updatedAt: string;
}

export interface AuthTokens {
	token: string;
	refreshToken: string;
	tokenExpires: number;
}

export interface LoginResponse {
	data: {
		token: string;
		refreshToken: string;
		tokenExpires: number;
		user: StaffAccount;
	};
	message: string;
	statusCode: number;
	timestamp: string;
	path: string;
}

export interface ApiResponse<T> {
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
