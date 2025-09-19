import { useState, useCallback, useMemo } from "react";

export interface UsePaginationProps {
	totalItems: number;
	itemsPerPage?: number;
	initialPage?: number;
}

interface UsePaginationReturn {
	currentPage: number;
	totalPages: number;
	hasNextPage: boolean;
	hasPrevPage: boolean;
	setPage: (page: number) => void;
	nextPage: () => void;
	prevPage: () => void;
	reset: () => void;
}

export const usePagination = ({
	totalItems,
	itemsPerPage = 10,
	initialPage = 1,
}: UsePaginationProps): UsePaginationReturn => {
	const [currentPage, setCurrentPage] = useState(initialPage);

	const totalPages = useMemo(
		() => Math.ceil(totalItems / itemsPerPage),
		[totalItems, itemsPerPage]
	);

	const hasNextPage = useMemo(
		() => currentPage < totalPages,
		[currentPage, totalPages]
	);

	const hasPrevPage = useMemo(() => currentPage > 1, [currentPage]);

	const setPage = useCallback(
		(page: number) => {
			if (page >= 1 && page <= totalPages) {
				setCurrentPage(page);
			}
		},
		[totalPages]
	);

	const nextPage = useCallback(() => {
		if (hasNextPage) {
			setCurrentPage((prev) => prev + 1);
		}
	}, [hasNextPage]);

	const prevPage = useCallback(() => {
		if (hasPrevPage) {
			setCurrentPage((prev) => prev - 1);
		}
	}, [hasPrevPage]);

	const reset = useCallback(() => {
		setCurrentPage(initialPage);
	}, [initialPage]);

	return {
		currentPage,
		totalPages,
		hasNextPage,
		hasPrevPage,
		setPage,
		nextPage,
		prevPage,
		reset,
	};
};
