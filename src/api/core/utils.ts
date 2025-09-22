import type { AxiosResponse } from "axios";
import type { ApiResponse, PaginatedResponse } from "@/types";

export const extractApiData = <T>(
	response: AxiosResponse<ApiResponse<T>>
): T => {
	return response.data.data;
};

export const extractPaginatedData = <T>(
	response: AxiosResponse<ApiResponse<PaginatedResponse<T>>>
): PaginatedResponse<T> => {
	const responseData = response.data.data;

	if (
		responseData &&
		typeof responseData === "object" &&
		"data" in responseData &&
		"meta" in responseData
	) {
		const { data, meta } = responseData;
		return {
			data,
			meta: {
				...meta,
				page:
					meta.page ||
					(meta.skip !== undefined
						? Math.floor(meta.skip / (meta.limit || 10)) + 1
						: 1),
				totalPages:
					meta.totalPages || Math.ceil(meta.total / (meta.limit || 10)),
			},
		};
	}

	if (response.data.meta) {
		return {
			data: responseData as T[],
			meta: {
				...response.data.meta,
				page:
					response.data.meta.page ||
					(response.data.meta.skip !== undefined
						? Math.floor(
								response.data.meta.skip / (response.data.meta.limit || 10)
							) + 1
						: 1),
				totalPages:
					response.data.meta.totalPages ||
					Math.ceil(
						response.data.meta.total / (response.data.meta.limit || 10)
					),
			},
		};
	}

	const data = Array.isArray(responseData)
		? responseData
		: [responseData].filter(Boolean);
	return {
		data: data as T[],
		meta: {
			page: 1,
			limit: data.length,
			total: data.length,
			totalPages: 1,
			hasNext: false,
			hasPrev: false,
		},
	};
};

export const apiCall = async <T>(
	apiFunction: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
	const response = await apiFunction();
	return extractApiData(response);
};

export const isApiError = (
	error: any
): error is { response?: { data?: { message?: string } } } => {
	return error?.response?.data?.message !== undefined;
};

export const getApiErrorMessage = (error: any): string => {
	if (isApiError(error)) {
		return error.response?.data?.message || "Đã xảy ra lỗi không xác định";
	}
	return error.message || "Đã xảy ra lỗi không xác định";
};
