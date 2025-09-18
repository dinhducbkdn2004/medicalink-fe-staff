import type { StaffAccount } from "./common";

/**
 * Authentication Types
 */
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
