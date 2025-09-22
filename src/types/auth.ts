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
	access_token: string;
	refresh_token: string;
	user: StaffAccount;
}

export interface ChangePasswordRequest {
	currentPassword: string;
	newPassword: string;
}
