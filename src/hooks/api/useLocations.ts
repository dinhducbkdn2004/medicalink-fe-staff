import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getLocations,
	getActiveLocations,
	getLocationById,
	createLocation,
	updateLocation,
	deleteLocation,
	toggleLocationStatus,
	getLocationsByCity,
	getLocationStats,
} from "@/api/locations";
import { extractApiData } from "@/api/client";
import type {
	PaginationParams,
	CreateLocationRequest,
	UpdateLocationRequest,
} from "@/types/api";

// Query keys
export const locationKeys = {
	all: ["locations"] as const,
	lists: () => [...locationKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			city?: string;
			state?: string;
			isActive?: boolean;
		}
	) => [...locationKeys.lists(), params] as const,
	active: () => [...locationKeys.all, "active"] as const,
	details: () => [...locationKeys.all, "detail"] as const,
	detail: (id: string) => [...locationKeys.details(), id] as const,
	byCity: (city: string, params?: PaginationParams) =>
		[...locationKeys.all, "city", city, params] as const,
	stats: () => [...locationKeys.all, "stats"] as const,
};

/**
 * Location Query Hooks
 */

// Get locations with pagination and filters
export const useLocations = (
	params?: PaginationParams & {
		search?: string;
		city?: string;
		state?: string;
		isActive?: boolean;
	}
) =>
	useQuery({
		queryKey: locationKeys.list(params),
		queryFn: async () => extractApiData(await getLocations(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get active locations (for dropdowns)
export const useActiveLocations = () =>
	useQuery({
		queryKey: locationKeys.active(),
		queryFn: async () => extractApiData(await getActiveLocations()),
		staleTime: 1000 * 60 * 10, // 10 minutes
	});

// Get location by ID
export const useLocation = (id: string) =>
	useQuery({
		queryKey: locationKeys.detail(id),
		queryFn: async () => extractApiData(await getLocationById(id)),
		enabled: !!id,
	});

// Get locations by city
export const useLocationsByCity = (city: string, params?: PaginationParams) =>
	useQuery({
		queryKey: locationKeys.byCity(city, params),
		queryFn: async () => extractApiData(await getLocationsByCity(city, params)),
		enabled: !!city,
	});

// Get location statistics
export const useLocationStats = () =>
	useQuery({
		queryKey: locationKeys.stats(),
		queryFn: async () => extractApiData(await getLocationStats()),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Location Mutation Hooks
 */

// Create location mutation
export const useCreateLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateLocationRequest) =>
			extractApiData(await createLocation(data)),
		onSuccess: () => {
			// Invalidate location lists, active list, and stats
			queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: locationKeys.active() });
			queryClient.invalidateQueries({ queryKey: locationKeys.stats() });
		},
	});
};

// Update location mutation
export const useUpdateLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateLocationRequest;
		}) => extractApiData(await updateLocation(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate location lists, active list, detail, and stats
			queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: locationKeys.active() });
			queryClient.invalidateQueries({ queryKey: locationKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: locationKeys.stats() });
		},
	});
};

// Delete location mutation
export const useDeleteLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteLocation(id)),
		onSuccess: (_, id) => {
			// Invalidate location lists, active list, and stats
			queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: locationKeys.active() });
			queryClient.invalidateQueries({ queryKey: locationKeys.stats() });
			// Remove detail from cache
			queryClient.removeQueries({ queryKey: locationKeys.detail(id) });
		},
	});
};

// Toggle location status mutation
export const useToggleLocationStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			extractApiData(await toggleLocationStatus(id, isActive)),
		onSuccess: (_, { id }) => {
			// Invalidate location lists, active list, detail, and stats
			queryClient.invalidateQueries({ queryKey: locationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: locationKeys.active() });
			queryClient.invalidateQueries({ queryKey: locationKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: locationKeys.stats() });
		},
	});
};
