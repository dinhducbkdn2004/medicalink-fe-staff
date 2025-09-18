import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	login,
	logout,
	getCurrentUser,
	updateProfile,
	changePassword,
	forgotPassword,
	resetPassword,
} from "@/api/auth";
import { extractApiData } from "@/api/core/utils";
import { CACHE_TIME, STORAGE_KEYS } from "@/constants/api";
import type {
	LoginRequest,
	ChangePasswordRequest,
	StaffAccount,
} from "@/types";

// Query keys
export const authKeys = {
	all: ["auth"] as const,
	profile: () => [...authKeys.all, "profile"] as const,
};

/**
 * Auth Query Hooks
 */

// Get current user profile
export const useCurrentUser = () => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
			: null;

	return useQuery({
		queryKey: authKeys.profile(),
		queryFn: async () => extractApiData(await getCurrentUser()),
		staleTime: CACHE_TIME.MEDIUM, // 5 minutes
		retry: false,
		enabled: !!token, // Chỉ gọi API khi có token
	});
};

/**
 * Auth Mutation Hooks
 */

// Login mutation
export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginRequest) => extractApiData(await login(data)),
		onSuccess: (data) => {
			// Store tokens
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.token);
			localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refreshToken);
			localStorage.setItem(STORAGE_KEYS.USER_ROLE, data.user.role);

			// Set user data in cache
			queryClient.setQueryData(authKeys.profile(), data.user);
		},
	});
};

// Logout mutation
export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => extractApiData(await logout()),
		onSuccess: () => {
			// Clear tokens
			localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
			localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);

			// Clear all queries
			queryClient.clear();

			// Redirect to login
			window.location.href = "/login";
		},
	});
};

// Update profile mutation
export const useUpdateProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: Partial<StaffAccount>) =>
			extractApiData(await updateProfile(data)),
		onSuccess: (data) => {
			// Update profile cache
			queryClient.setQueryData(authKeys.profile(), data);
		},
	});
};

// Change password mutation
export const useChangePassword = () =>
	useMutation({
		mutationFn: async (data: ChangePasswordRequest) =>
			extractApiData(await changePassword(data)),
	});

// Forgot password mutation
export const useForgotPassword = () =>
	useMutation({
		mutationFn: async (email: string) =>
			extractApiData(await forgotPassword(email)),
	});

// Reset password mutation
export const useResetPassword = () =>
	useMutation({
		mutationFn: async (data: { token: string; newPassword: string }) =>
			extractApiData(await resetPassword(data)),
	});
