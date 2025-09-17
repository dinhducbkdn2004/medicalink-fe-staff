import { useCurrentUser } from "@/hooks/api";
import { STORAGE_KEYS } from "@/constants/api";

export const useAuthStatus = () => {
	const token =
		typeof window !== "undefined"
			? localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)
			: null;
	const { data: user, isLoading, isError } = useCurrentUser();

	const isAuthenticated = !!(token && (user || isLoading) && !isError);

	return {
		user,
		isLoading,
		isError,
		isAuthenticated,
		token,
	};
};
