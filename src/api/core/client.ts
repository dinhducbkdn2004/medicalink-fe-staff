import { toast } from "sonner";
import axios, { type AxiosResponse, InternalAxiosRequestConfig } from "axios";
import { REQUEST_TIMEOUT, STORAGE_KEYS } from "@/constants/api";
import { handleApiError } from "./errorHandler";

const API_BASE_URL =
	import.meta.env["VITE_API_BASE_URL"] || "https://medicalink-be.onrender.com";

export const apiClient = axios.create({
	baseURL: API_BASE_URL,
	timeout: REQUEST_TIMEOUT,
	headers: {
		"Content-Type": "application/json",
	},
});

// Setup request interceptor
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

// Setup response interceptor
apiClient.interceptors.response.use(
	(response: AxiosResponse) => {
		// Handle success responses
		if (
			["post", "put", "patch", "delete"].includes(
				response.config.method?.toLowerCase() || ""
			)
		) {
			// Show success toast for mutating requests
			toast.success("Operation successful");
		}
		return response;
	},
	async (error) => {
		// Use centralized error handler
		return handleApiError(error);
	}
);

export default apiClient;
