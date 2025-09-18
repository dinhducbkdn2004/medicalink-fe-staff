import { useState, useCallback } from "react";
import type { PaginationParams } from "@/types";

interface UsePaginationOptions {
	initialPage?: number;
	initialLimit?: number;
}

interface UsePaginationReturn {
	params: PaginationParams;
	setPage: (page: number) => void;
	setLimit: (limit: number) => void;
	setSort: (sortBy: string, sortOrder?: "asc" | "desc") => void;
	reset: () => void;
	nextPage: () => void;
	prevPage: () => void;
	goToPage: (page: number) => void;
}

/**
 * Custom hook for pagination management
 */
export const usePagination = (
	options: UsePaginationOptions = {}
): UsePaginationReturn => {
	const { initialPage = 1, initialLimit = 10 } = options;

	const [params, setParams] = useState<PaginationParams>({
		page: initialPage,
		limit: initialLimit,
	});

	const setPage = useCallback((page: number) => {
		setParams((prev) => ({ ...prev, page }));
	}, []);

	const setLimit = useCallback((limit: number) => {
		setParams((prev) => ({ ...prev, limit, page: 1 })); // Reset to first page when changing limit
	}, []);

	const setSort = useCallback(
		(sortBy: string, sortOrder: "asc" | "desc" = "asc") => {
			setParams((prev) => ({ ...prev, sortBy, sortOrder }));
		},
		[]
	);

	const reset = useCallback(() => {
		setParams({
			page: initialPage,
			limit: initialLimit,
		});
	}, [initialPage, initialLimit]);

	const nextPage = useCallback(() => {
		setParams((prev) => ({ ...prev, page: (prev.page || 1) + 1 }));
	}, []);

	const prevPage = useCallback(() => {
		setParams((prev) => ({ ...prev, page: Math.max(1, (prev.page || 1) - 1) }));
	}, []);

	const goToPage = useCallback((page: number) => {
		setParams((prev) => ({ ...prev, page: Math.max(1, page) }));
	}, []);

	return {
		params,
		setPage,
		setLimit,
		setSort,
		reset,
		nextPage,
		prevPage,
		goToPage,
	};
};
