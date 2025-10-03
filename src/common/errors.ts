import type { AxiosError } from "axios";
import type { ApiError } from "@/types";

export const isApiError = (error: unknown): error is AxiosError<ApiError> => {
	return (
		typeof error === "object" &&
		error !== null &&
		"response" in error &&
		typeof (error as any).response?.data?.message === "string"
	);
};
