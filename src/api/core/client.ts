import axios, { type AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { REQUEST_TIMEOUT, STORAGE_KEYS } from "@/constants/api";
import { handleApiError } from "./errorHandler";
import { toastManager } from "@/lib/toastManager";

const API_BASE_URL =
	import.meta.env["VITE_APP_ENVIRONMENT"] === "production"
		? import.meta.env["VITE_API_BASE_URL_PRO"] || "https://api.medicalink.click"
		: import.meta.env["VITE_API_BASE_URL_DEV"] || "http://localhost:3000";

export const apiClient = axios.create({
	baseURL: API_BASE_URL + "/api",
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
	(error) => {
		console.error("Request error:", error);
		return Promise.reject(new Error("Request error"));
	}
);

apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		if (
			["post", "put", "patch", "delete"].includes(
				response.config.method?.toLowerCase() || ""
			)
		) {
			const message =
				response.data?.message || "Operation completed successfully";
			toastManager.success(message);
		}
		return response;
	},
	async (error) => {
		console.warn("API Error intercepted:", {
			code: error.code,
			message: error.message,
			response: error.response,
			request: error.request,
			url: error.config?.url,
		});

		const isLoginRequest = error.config?.url?.includes("/auth/login");
		const isRefreshRequest = error.config?.url?.includes("/auth/refresh");

		if (error.request && !error.response) {
			if (error.code === "ECONNABORTED" || error.message.includes("timeout")) {
				toastManager.error(
					"Request timeout. The server is taking too long to respond."
				);
			} else if (
				error.code === "ERR_NETWORK" ||
				error.code === "ERR_CONNECTION_REFUSED" ||
				!navigator.onLine
			) {
				toastManager.error(
					"Unable to connect to server. Please check your connection."
				);
			} else {
				toastManager.error("Network connection error. Please try again.");
			}
			return Promise.reject(error);
		}

		if (isLoginRequest || isRefreshRequest) {
			console.warn(
				"Login/refresh request error, skipping general error handling"
			);
			return Promise.reject(error);
		}

		return handleApiError(error);
	}
);

export default apiClient;
