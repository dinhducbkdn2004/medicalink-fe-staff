import type { AxiosError } from "axios";
import type { ApiError } from "@/types";

export class ApiErrorException extends Error {
	constructor(
		public statusCode: number,
		public apiMessage: string,
		public path: string,
		public timestamp: string
	) {
		super(apiMessage);
		this.name = "ApiErrorException";
	}
}

export class NetworkErrorException extends Error {
	constructor(message = "Network connection failed") {
		super(message);
		this.name = "NetworkErrorException";
	}
}

export class TimeoutErrorException extends Error {
	constructor(message = "Request timeout") {
		super(message);
		this.name = "TimeoutErrorException";
	}
}

export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as any).response?.data?.message === "string"
	);
};

export const isNetworkError = (error: unknown): boolean => {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as any).code === "ERR_NETWORK"
	);
};

export const isTimeoutError = (error: unknown): boolean => {
	return (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as any).code === "ECONNABORTED"
	);
};

export const parseApiError = (
	error: unknown
): {
	message: string;
	statusCode?: number;
	type: "api" | "network" | "timeout" | "unknown";
} => {
	if (isApiError(error)) {
		const statusCode = error.response?.status;
		return {
			message: error.response?.data?.message || "An unknown error occurred",
			...(statusCode && { statusCode }),
			type: "api",
		};
	}

	if (isNetworkError(error)) {
		return {
			message:
				"Network connection error. Please check your internet connection.",
			type: "network",
		};
	}

	if (isTimeoutError(error)) {
		return {
			message: "Request timed out. Please try again.",
			type: "timeout",
		};
	}

	return {
		message:
			error instanceof Error ? error.message : "An unknown error occurred",
		type: "unknown",
	};
};
