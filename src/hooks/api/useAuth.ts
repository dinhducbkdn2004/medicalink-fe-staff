import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	login,
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

export const authKeys = {
	all: ["auth"] as const,
	profile: () => [...authKeys.all, "profile"] as const,
};

export const useCurrentUser = () => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
			: null;

	const storedUser = (() => {
		if (typeof window === "undefined") return null;
		try {
			const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
			return userData ? JSON.parse(userData) : null;
		} catch {
			return null;
		}
	})();

	const shouldFetch = !!token && !storedUser;

	return useQuery({
		queryKey: authKeys.profile(),
		queryFn: async () => extractApiData(await getCurrentUser()),
		staleTime: CACHE_TIME.MEDIUM,
		gcTime: CACHE_TIME.LONG,
		retry: false,
		enabled: shouldFetch,
		refetchOnWindowFocus: false,
		refetchOnMount: false,
		refetchOnReconnect: false,
		refetchInterval: false,
		refetchIntervalInBackground: false,
	});
};

export const useLogin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: LoginRequest) => extractApiData(await login(data)),
		onSuccess: (data) => {
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, data.access_token);
			localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, data.refresh_token);
			localStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(data.user));
			localStorage.setItem(STORAGE_KEYS.USER_ROLE, data.user.role);

			queryClient.setQueryData(authKeys.profile(), data.user);
		},
	});
};

// Logout mutation
export const useLogout = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async () => {
			localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
			localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
			localStorage.removeItem(STORAGE_KEYS.USER_DATA);
			localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
			return Promise.resolve({ success: true });
		},
		onSuccess: () => {
			queryClient.clear();
			window.location.href = "/login";
		},
	});
};

export const useUpdateProfile = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async (data: Partial<StaffAccount>) =>
			extractApiData(await updateProfile(data)),
		onSuccess: (data) => {
			queryClient.setQueryData(authKeys.profile(), data);
		},
	});
};

export const useChangePassword = () =>
	useMutation({
		mutationFn: async (data: ChangePasswordRequest) =>
			extractApiData(await changePassword(data)),
	});

export const useForgotPassword = () =>
	useMutation({
		mutationFn: async (email: string) =>
			extractApiData(await forgotPassword(email)),
	});

export const useResetPassword = () =>
	useMutation({
		mutationFn: async (data: { token: string; newPassword: string }) =>
			extractApiData(await resetPassword(data)),
	});
