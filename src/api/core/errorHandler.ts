import { toast } from "sonner";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { STORAGE_KEYS } from "@/constants/api";
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

	const errorMessage = getErrorMessage(error);
	toast.error(errorMessage);
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
	toast.error("Session expired. Please log in again.");
	setTimeout(() => {
		window.location.href = "/login";
	}, 1000);
};

const getErrorMessage = (error: AxiosError<ApiError>): string => {
	const errorData = error.response?.data;
	const backendMessage = errorData?.message;
	let detailedMessage = backendMessage || "An unknown error occurred";

	if (errorData?.details && Array.isArray(errorData.details)) {
		const detailsText = errorData.details
			.map((detail) =>
				typeof detail === "string" ? detail : JSON.stringify(detail)
			)
			.join("; ");
		detailedMessage = `${detailedMessage}. Details: ${detailsText}`;
	}

	switch (error.response?.status) {
		case 400:
			return backendMessage || `Invalid data: ${detailedMessage}`;
		case 401:
			return backendMessage || "You are not authorized. Please log in again.";
		case 403:
			return (
				backendMessage || "You do not have permission to perform this action."
			);
		case 404:
			return backendMessage || `Resource not found.`;
		case 409:
			return backendMessage || `Data conflict: ${detailedMessage}`;
		case 422:
			return backendMessage || `Unprocessable entity: ${detailedMessage}`;
		case 429:
			return backendMessage || "Too many requests. Please try again later.";
		case 500:
			return backendMessage || "Internal server error. Please try again later.";
		case 502:
		case 503:
		case 504:
			return (
				backendMessage ||
				"Service temporarily unavailable. Please try again later."
			);
		default:
			if (error.code === "ECONNABORTED") {
				return "Request timed out. Please try again later.";
			} else if (error.code === "ERR_NETWORK") {
				return "Network error. Please check your internet connection.";
			}
			return detailedMessage;
	}
};
