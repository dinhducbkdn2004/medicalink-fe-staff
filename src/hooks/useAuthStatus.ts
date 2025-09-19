import { useCurrentUser } from "@/hooks/api";
import { STORAGE_KEYS } from "@/constants/api";
import type { StaffAccount } from "@/types";
import { useMemo } from "react";

export const useAuthStatus = () => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
			: null;

	const storedUser = useMemo(() => {
		if (typeof window === "undefined") return null;
		try {
			const userData = localStorage.getItem(STORAGE_KEYS.USER_DATA);
			return userData ? (JSON.parse(userData) as StaffAccount) : null;
		} catch {
			return null;
		}
	}, []);

	const { data: apiUser, isLoading, isError } = useCurrentUser();

	const user = storedUser || apiUser;

	const isAuthenticated = useMemo(() => {
		if (!token) return false;

		if (storedUser && token) return true;

		if (isLoading && token) return true;

		if (apiUser) return true;

		if (isError && storedUser && token) return true;

		return false;
	}, [token, storedUser, apiUser, isLoading, isError]);

	const effectiveIsLoading = isLoading && !!token && !storedUser;

	return {
		user,
		isLoading: effectiveIsLoading,
		isError,
		isAuthenticated,
		token,
	};
};
