import { useState, useCallback } from "react";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/api/core/utils";

interface UseApiState<T> {
	data: T | null;
	loading: boolean;
	error: string | null;
}

export const useApi = <T>() => {
	const [state, setState] = useState<UseApiState<T>>({
		data: null,
		loading: false,
		error: null,
	});

	const execute = useCallback(
		async <P extends any[]>(
			apiFunction: (...args: P) => Promise<T>,
			...args: P
		): Promise<T | null> => {
			setState({ data: null, loading: true, error: null });

			try {
				const result = await apiFunction(...args);
				setState({ data: result, loading: false, error: null });
				return result;
			} catch (error) {
				const errorMessage = getApiErrorMessage(error);
				setState({ data: null, loading: false, error: errorMessage });
				toast.error(errorMessage);
				return null;
			}
		},
		[]
	);

	const reset = useCallback(() => {
		setState({ data: null, loading: false, error: null });
	}, []);

	return {
		...state,
		execute,
		reset,
	};
};
