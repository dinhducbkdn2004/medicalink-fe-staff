import { toast } from "sonner";
import axios, { type AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { REQUEST_TIMEOUT, STORAGE_KEYS } from "@/constants/api";
import { handleApiError } from "./errorHandler";

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
			toast.success(
				response.data?.message || "Operation completed successfully"
			);
		}
		return response;
	},
	async (error) => {
		return handleApiError(error);
	}
);

export default apiClient;
