import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getWorkLocations,
	getActiveWorkLocations,
	getWorkLocationById,
	createWorkLocation,
	updateWorkLocation,
	deleteWorkLocation,
	getWorkLocationStats,
} from "@/api/locations";
import { extractApiData, extractPaginatedData } from "@/api/core/utils";
import type {
	PaginationParams,
	CreateWorkLocationRequest,
	UpdateWorkLocationRequest,
	WorkLocationQueryParams,
} from "@/types";

export const workLocationKeys = {
	all: ["workLocations"] as const,
	lists: () => [...workLocationKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			isActive?: boolean;
		}
	) => [...workLocationKeys.lists(), params] as const,
	active: () => [...workLocationKeys.all, "active"] as const,
	details: () => [...workLocationKeys.all, "detail"] as const,
	detail: (id: string) => [...workLocationKeys.details(), id] as const,
	stats: () => [...workLocationKeys.all, "stats"] as const,
};

// Get work locations with pagination and filters
export const useWorkLocations = (params?: WorkLocationQueryParams) => {
	return useQuery({
		queryKey: workLocationKeys.list(params),
		queryFn: async () => extractPaginatedData(await getWorkLocations(params)),
		staleTime: 1000 * 60 * 5,
	});
};

// Get active work locations (for dropdowns)
export const useActiveWorkLocations = () =>
	useQuery({
		queryKey: workLocationKeys.active(),
		queryFn: async () => extractApiData(await getActiveWorkLocations()),
		staleTime: 1000 * 60 * 10,
	});

// Get work location by ID
export const useWorkLocation = (id: string) =>
	useQuery({
		queryKey: workLocationKeys.detail(id),
		queryFn: async () => extractApiData(await getWorkLocationById(id)),
		enabled: !!id,
	});

// Get work location statistics
export const useWorkLocationStats = () =>
	useQuery({
		queryKey: workLocationKeys.stats(),
		queryFn: async () => extractApiData(await getWorkLocationStats()),
		staleTime: 1000 * 60 * 5,
	});

// Create work location mutation
export const useCreateWorkLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateWorkLocationRequest) =>
			extractApiData(await createWorkLocation(data)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: workLocationKeys.active() });
			queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() });
		},
	});
};

// Update work location mutation
export const useUpdateWorkLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateWorkLocationRequest;
		}) => extractApiData(await updateWorkLocation(id, data)),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: workLocationKeys.active() });
			queryClient.invalidateQueries({
				queryKey: workLocationKeys.detail(id),
			});
			queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() });
		},
	});
};

// Delete work location mutation
export const useDeleteWorkLocation = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) =>
			extractApiData(await deleteWorkLocation(id)),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: workLocationKeys.lists() });
			queryClient.invalidateQueries({ queryKey: workLocationKeys.active() });
			queryClient.invalidateQueries({ queryKey: workLocationKeys.stats() });
			queryClient.removeQueries({ queryKey: workLocationKeys.detail(id) });
		},
	});
};
