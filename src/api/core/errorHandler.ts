import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { STORAGE_KEYS } from "@/constants/api";
import { MESSAGES } from "@/lib/messages";
import { triggerServerDownCheck } from "@/lib/serverStatus";
import { toastManager } from "@/lib/toastManager";
import type { ApiError } from "@/types";

export const handleApiError = (error: AxiosError<ApiError>) => {
	const originalRequest = error.config as InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

	const isLoginRequest = originalRequest?.url?.includes("/auth/login");

	if (error.response) {
		const status = error.response.status;

		switch (status) {
			case 401:
				if (!originalRequest._retry && !isLoginRequest) {
					return handleTokenRefresh(error, originalRequest);
				}
				if (isLoginRequest) {
					return Promise.reject(error);
				}
				toastManager.error(MESSAGES.ERROR.GENERAL.UNAUTHORIZED);
				break;
			case 403:
				toastManager.error(MESSAGES.ERROR.GENERAL.FORBIDDEN);
				break;
			case 404:
				toastManager.error(MESSAGES.ERROR.GENERAL.NOT_FOUND);
				break;
			case 422:
				toastManager.error(MESSAGES.ERROR.GENERAL.VALIDATION_ERROR);
				break;
			case 429:
				toastManager.error("Too many requests. Please try again later.");
				break;
			case 500:
			case 502:
			case 503:
			case 504:
				toastManager.error(MESSAGES.ERROR.GENERAL.SERVER_ERROR);
				triggerServerDownCheck();
				break;
			default: {
				const message =
					error.response.data?.message || MESSAGES.ERROR.GENERAL.SERVER_ERROR;
				toastManager.error(message);
				break;
			}
		}
	} else if (error.request) {
		if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
			toastManager.error(MESSAGES.ERROR.GENERAL.TIMEOUT);
		} else if (
			error.code === "ERR_NETWORK" ||
			error.code === "ERR_CONNECTION_REFUSED" ||
			error.code === "ECONNREFUSED" ||
			!navigator.onLine
		) {
			toastManager.error(MESSAGES.ERROR.GENERAL.CONNECTION_ERROR);
		} else {
			toastManager.error(
				"Unable to connect to server. Please check your connection."
			);
			triggerServerDownCheck();
		}
	} else {
		toastManager.error("An unexpected error occurred. Please try again.");
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
	toastManager.error(MESSAGES.WARNING.SESSION_EXPIRED, {
		cooldown: 5000,
	});
	setTimeout(() => {
		window.location.href = "/login";
	}, 1000);
};
