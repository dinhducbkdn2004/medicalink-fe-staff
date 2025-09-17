import axios, {
	type AxiosError,
	type AxiosResponse,
	type InternalAxiosRequestConfig,
} from "axios";
import { toast } from "sonner";
import type { ApiError, ApiResponse } from "@/types/api";
import { REQUEST_TIMEOUT, STORAGE_KEYS } from "@/constants/api";

const API_BASE_URL =
	(import.meta.env["VITE_API_BASE_URL"]) ||
	"https://medicalink-be.onrender.com";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: REQUEST_TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});

apiClient.interceptors.request.use(
	(config: InternalAxiosRequestConfig) => {
		const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
		if (token) {
			config.headers.Authorization = `Bearer ${token}`;
		}
		return config;
	},
	(error: AxiosError) => {
		console.error("Request error:", error);
		return Promise.reject(error);
	}
);

apiClient.interceptors.response.use(
	(response: AxiosResponse<ApiResponse>) => {
		if (
			["post", "put", "patch", "delete"].includes(
				response.config.method?.toLowerCase() || ""
			)
		) {
			if (response.data.message) {
				toast.success(response.data.message);
			}
		}
		return response;
	},
	async (error: AxiosError<ApiError>) => {
		const originalRequest = error.config as InternalAxiosRequestConfig & {
			_retry?: boolean;
		};

		if (error.response?.status === 401 && !originalRequest._retry) {
			originalRequest._retry = true;

			try {
				const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
				if (refreshToken) {
					const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
						refreshToken,
					});

					const { accessToken } = response.data.data as { accessToken: string };
					localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);

					if (originalRequest.headers) {
						originalRequest.headers.Authorization = `Bearer ${accessToken}`;
					}
					return await apiClient(originalRequest);
				}
			} catch {
				localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
				localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
				window.location.href = "/login";
				toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
				return Promise.reject(new Error("Refresh token failed"));
			}
		}

		const errorMessage =
			error.response?.data?.message || "Đã xảy ra lỗi không xác định";

		switch (error.response?.status) {
			case 400:
				toast.error(`Dữ liệu không hợp lệ: ${errorMessage}`);
				break;
			case 401:
				toast.error("Bạn không có quyền truy cập. Vui lòng đăng nhập lại.");
				if (!originalRequest._retry) {
					localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
					localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
					window.location.href = "/login";
				}
				break;
			case 403:
				toast.error("Bạn không có quyền thực hiện hành động này.");
				break;
			case 404:
				toast.error("Không tìm thấy tài nguyên yêu cầu.");
				break;
			case 409:
				toast.error(`Xung đột dữ liệu: ${errorMessage}`);
				break;
			case 422:
				toast.error(`Dữ liệu không được xác thực: ${errorMessage}`);
				break;
			case 429:
				toast.error("Quá nhiều yêu cầu. Vui lòng thử lại sau.");
				break;
			case 500:
				toast.error("Lỗi máy chủ nội bộ. Vui lòng thử lại sau.");
				break;
			case 502:
			case 503:
			case 504:
				toast.error("Dịch vụ tạm thời không khả dụng. Vui lòng thử lại sau.");
				break;
			default:
				if (error.code === "ECONNABORTED") {
					toast.error("Yêu cầu đã hết thời gian chờ. Vui lòng thử lại.");
				} else if (error.code === "ERR_NETWORK") {
					toast.error("Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.");
				} else {
					toast.error(errorMessage);
				}
		}

		return Promise.reject(error);
	}
);

export const extractApiData = <T>(
	response: AxiosResponse<ApiResponse<T>>
): T => {
	return response.data.data;
};

export const apiCall = async <T>(
	apiFunction: () => Promise<AxiosResponse<ApiResponse<T>>>
): Promise<T> => {
	const response = await apiFunction();
	return extractApiData(response);
};

export default apiClient;
