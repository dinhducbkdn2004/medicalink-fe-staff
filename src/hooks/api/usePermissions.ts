/**
 * Permission Hooks
 * React Query hooks for permission and group management
 */

import { useQuery } from "@tanstack/react-query";
import { getPermissions } from "@/api/permissions";
import { extractApiData } from "@/api/core/utils";
import { CACHE_TIME } from "@/constants/api";
import type { PaginationParams } from "@/types";

// ==================== Query Keys ====================

export const permissionKeys = {
	all: ["permissions"] as const,
	lists: () => [...permissionKeys.all, "list"] as const,
	list: (params?: PaginationParams) =>
		[...permissionKeys.lists(), params] as const,
};

// ==================== Permission Query Hooks ====================

/**
 * Get all permissions (read-only)
 * Permissions are managed by backend, not editable via API
 */
export const usePermissions = (params?: PaginationParams) => {
	return useQuery({
		queryKey: permissionKeys.list(params),
		queryFn: async () => extractApiData(await getPermissions(params)),
		staleTime: CACHE_TIME.LONG, // Permissions rarely change
	});
};
