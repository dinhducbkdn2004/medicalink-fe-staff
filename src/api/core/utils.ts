import type { AxiosResponse } from "axios";
import type { ApiResponse } from "@/types";

/**
 * Extract data from API response
 */
export const extractApiData = <T>(
	response: AxiosResponse<ApiResponse<T>>
): T => {
	return response.data.data;
};

/**
 * Generic API call wrapper
 */
export const apiCall = async <T>(
	apiFunction: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
	const response = await apiFunction();
	return extractApiData(response);
};

/**
 * Check if error is API error
 */
export const isApiError = (
	error: any
): error is { response?: { data?: { message?: string } } } => {
	return error?.response?.data?.message !== undefined;
};

/**
 * Get error message from API error
 */
export const getApiErrorMessage = (error: any): string => {
	if (isApiError(error)) {
		return error.response?.data?.message || "Đã xảy ra lỗi không xác định";
	}
	return error.message || "Đã xảy ra lỗi không xác định";
};
