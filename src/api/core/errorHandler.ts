import { toast } from "sonner";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { STORAGE_KEYS } from "@/constants/api";
import { MESSAGES } from "@/lib/messages";
import type { ApiError } from "@/types";

export const handleApiError = (error: AxiosError<ApiError>) => {
	const originalRequest = error.config as InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

	const isLoginRequest = originalRequest?.url?.includes("/auth/login");

	if (
		error.response?.status === 401 &&
		!originalRequest._retry &&
		!isLoginRequest
	) {
		return handleTokenRefresh(error, originalRequest);
	}
	return Promise.reject(error);
};

const handleTokenRefresh = async (
	error: AxiosError,
	originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
) => {
	originalRequest._retry = true;
	try {
		const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
		if (!refreshToken) {
			handleAuthFailure();
			return Promise.reject(error);
		}
		const response = await apiClient.post("/auth/refresh", {
			refresh_token: refreshToken,
		});
		const responseData = response.data;
		const newToken = responseData.data?.access_token;
		if (!newToken) {
			console.error("No token received from refresh endpoint:", responseData);
			handleAuthFailure();
			return Promise.reject(error);
		}
		localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, newToken);
		if (originalRequest.headers) {
			originalRequest.headers.Authorization = `Bearer ${newToken}`;
		}
		return await apiClient(originalRequest);
	} catch (refreshError) {
		console.error("Token refresh failed:", refreshError);
		handleAuthFailure();
		return Promise.reject(error);
	}
};

const handleAuthFailure = () => {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.USER_DATA);
	localStorage.removeItem(STORAGE_KEYS.USER_ROLE);
	if (typeof window !== "undefined" && (window as any).queryClient) {
		(window as any).queryClient.clear();
	}
	toast.error(MESSAGES.WARNING.SESSION_EXPIRED);
	setTimeout(() => {
		window.location.href = "/login";
	}, 1000);
};
