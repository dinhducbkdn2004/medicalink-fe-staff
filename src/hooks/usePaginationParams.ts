import { useSearch, useNavigate } from "@tanstack/react-router";
import { useCallback } from "react";

/**
 * Hook to manage pagination, search, and sort parameters synchronized with URL
 *
 * @example
 * ```tsx
 * const { params, updateParams } = usePaginationParams({
 *   defaultPage: 1,
 *   defaultLimit: 10,
 *   defaultSortBy: 'createdAt',
 *   defaultSortOrder: 'DESC'
 * });
 *
 * // Use params in API call
 * const { data } = useDoctors(params);
 *
 * // Update params (will sync with URL)
 * updateParams({ page: 2, search: 'john' });
 * ```
 */

interface PaginationDefaults {
	defaultPage?: number;
	defaultLimit?: number;
	defaultSortBy?: string;
	defaultSortOrder?: "ASC" | "DESC";
}

interface PaginationParams {
	page: number;
	limit: number;
	sortBy?: string;
	sortOrder?: "ASC" | "DESC";
	search?: string;
	[key: string]: any;
}

export function usePaginationParams({
	defaultPage = 1,
	defaultLimit = 10,
	defaultSortBy,
	defaultSortOrder = "DESC",
}: PaginationDefaults = {}) {
	const navigate = useNavigate();
	const searchParams = useSearch({ strict: false }) as any;

	const params: PaginationParams = {
		page: Number(searchParams.page) || defaultPage,
		limit: Number(searchParams.limit) || defaultLimit,
		...(searchParams.sortBy && { sortBy: searchParams.sortBy }),
		...(searchParams.sortOrder && { sortOrder: searchParams.sortOrder }),
		...(searchParams.search && { search: searchParams.search }),
		...Object.keys(searchParams).reduce(
			(acc, key) => {
				if (!["page", "limit", "sortBy", "sortOrder", "search"].includes(key)) {
					acc[key] = searchParams[key];
				}
				return acc;
			},
			{} as Record<string, any>
		),
	};

	if (!params.sortBy && defaultSortBy) {
		params.sortBy = defaultSortBy;
	}
	if (!params.sortOrder && defaultSortOrder) {
		params.sortOrder = defaultSortOrder;
	}

	const updateParams = useCallback(
		(updates: Partial<PaginationParams>) => {
			const newParams = { ...searchParams, ...updates };

			Object.keys(newParams).forEach((key) => {
				if (
					newParams[key] === undefined ||
					newParams[key] === null ||
					newParams[key] === ""
				) {
					delete newParams[key];
				}
			});

			void navigate({
				search: newParams,
				replace: true,
			});
		},
		[navigate, searchParams]
	);

	const resetParams = useCallback(() => {
		const resetSearch: any = {
			page: defaultPage,
			limit: defaultLimit,
			...(defaultSortBy && { sortBy: defaultSortBy }),
			...(defaultSortOrder && { sortOrder: defaultSortOrder }),
		};
		void navigate({
			search: resetSearch,
			replace: true,
		});
	}, [navigate, defaultPage, defaultLimit, defaultSortBy, defaultSortOrder]);

	const setPage = useCallback(
		(page: number) => {
			updateParams({ page });
		},
		[updateParams]
	);

	const setLimit = useCallback(
		(limit: number) => {
			updateParams({ limit, page: 1 });
		},
		[updateParams]
	);

	const setSearch = useCallback(
		(search: string) => {
			updateParams({ search, page: 1 });
		},
		[updateParams]
	);

	const setSort = useCallback(
		(sortBy: string, sortOrder?: "ASC" | "DESC") => {
			updateParams({ sortBy, ...(sortOrder && { sortOrder }) });
		},
		[updateParams]
	);

	return {
		params,
		updateParams,
		resetParams,
		setPage,
		setLimit,
		setSearch,
		setSort,
	};
}
