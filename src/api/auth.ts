import { apiClient } from "./core/client";
import type {
	LoginRequest,
	LoginResponse,
	ChangePasswordRequest,
	StaffAccount,
	ApiResponse,
} from "@/types";

// Login
export const login = (data: LoginRequest) =>
	apiClient.post<ApiResponse<LoginResponse>>("/auth/login", data);

export const refreshToken = (refreshToken: string) =>
	apiClient.post<ApiResponse<{ access_token: string; refresh_token: string }>>(
		"/auth/refresh",
		{
			refresh_token: refreshToken,
		}
	);

// Change password
export const changePassword = (data: ChangePasswordRequest) =>
	apiClient.patch<ApiResponse<{ message: string }>>(
		"/auth/change-password",
		data
	);

// Get current user profile
export const getCurrentUser = () =>
	apiClient.get<ApiResponse<StaffAccount>>("/auth/profile");

// Update current user profile
export const updateProfile = (data: Partial<StaffAccount>) =>
	apiClient.patch<ApiResponse<StaffAccount>>("/auth/profile", data);

// Forgot password
export const forgotPassword = (email: string) =>
	apiClient.post<ApiResponse<{ message: string }>>("/auth/forgot-password", {
		email,
	});

// Reset password
export const resetPassword = (data: { token: string; newPassword: string }) =>
	apiClient.post<ApiResponse<{ message: string }>>(
		"/auth/reset-password",
		data
	);

// Verify email
export const verifyEmail = (token: string) =>
	apiClient.post<ApiResponse<{ message: string }>>("/auth/verify-email", {
		token,
	});

// Resend verification email
export const resendVerificationEmail = (email: string) =>
	apiClient.post<ApiResponse<{ message: string }>>(
		"/auth/resend-verification",
		{
			email,
		}
	);
