import { toast } from "sonner";
import type { AxiosError, InternalAxiosRequestConfig } from "axios";
import { apiClient } from "./client";
import { STORAGE_KEYS } from "@/constants/api";
import type { ApiError } from "@/types";

/**
 * Handle API errors with user-friendly messages
 */
export const handleApiError = (error: AxiosError<ApiError>) => {
	const originalRequest = error.config as InternalAxiosRequestConfig & {
		_retry?: boolean;
	};

	// Handle token refresh
	if (error.response?.status === 401 && !originalRequest._retry) {
		return handleTokenRefresh(error, originalRequest);
	}

	// Handle different error types
	const errorMessage = getErrorMessage(error);
	toast.error(errorMessage);

	return Promise.reject(error);
};

/**
 * Handle token refresh logic
 */
const handleTokenRefresh = async (
	error: AxiosError,
	originalRequest: InternalAxiosRequestConfig & { _retry?: boolean }
) => {
	originalRequest._retry = true;

	try {
		const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
		if (refreshToken) {
			const response = await apiClient.post("/auth/refresh", {
				refreshToken,
			});

			const { accessToken } = response.data.data as { accessToken: string };
			localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

			if (originalRequest.headers) {
				originalRequest.headers.Authorization = `Bearer ${accessToken}`;
			}
			return await apiClient(originalRequest);
		} else {
			handleAuthFailure();
			return Promise.reject(error);
		}
	} catch {
		handleAuthFailure();
		return Promise.reject(error);
	}
};

/**
 * Handle authentication failure
 */
const handleAuthFailure = () => {
	localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
	localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
	window.location.href = "/login";
	toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
};

/**
 * Get user-friendly error message
 */
const getErrorMessage = (error: AxiosError<ApiError>): string => {
	const errorMessage =
		error.response?.data?.message || "Đã xảy ra lỗi không xác định";

	switch (error.response?.status) {
		case 400:
			return `Dữ liệu không hợp lệ: ${errorMessage}`;
		case 401:
			return "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.";
		case 403:
			return "Bạn không có quyền thực hiện hành động này.";
		case 404:
			return "Không tìm thấy tài nguyên yêu cầu.";
		case 409:
			return `Xung đột dữ liệu: ${errorMessage}`;
		case 422:
			return `Dữ liệu không được xác thực: ${errorMessage}`;
		case 429:
			return "Quá nhiều yêu cầu. Vui lòng thử lại sau.";
		case 500:
			return "Lỗi máy chủ nội bộ. Vui lòng thử lại sau.";
		case 502:
		case 503:
		case 504:
			return "Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.";
		default:
			if (error.code === "ECONNABORTED") {
				return "Yêu cầu đã hết thời gian chờ. Vui lòng thử lại sau.";
			} else if (error.code === "ERR_NETWORK") {
				return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
			}
			return errorMessage;
	}
};
