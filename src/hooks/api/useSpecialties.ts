import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getSpecialties,
	getActiveSpecialties,
	getSpecialtyById,
	createSpecialty,
	updateSpecialty,
	deleteSpecialty,
	toggleSpecialtyStatus,
	getSpecialtyStats,
} from "@/api/specialties";
import { extractApiData, extractPaginatedData } from "@/api/core/utils";
import type {
	PaginationParams,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
} from "@/types";

export const specialtyKeys = {
	all: ["specialties"] as const,
	lists: () => [...specialtyKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			search?: string;
			isActive?: boolean;
		}
	) => [...specialtyKeys.lists(), params] as const,
	active: () => [...specialtyKeys.all, "active"] as const,
	details: () => [...specialtyKeys.all, "detail"] as const,
	detail: (id: string) => [...specialtyKeys.details(), id] as const,
	stats: () => [...specialtyKeys.all, "stats"] as const,
};

// Get specialties with pagination and filters
export const useSpecialties = (
	params?: PaginationParams & {
		search?: string;
		isActive?: boolean;
	}
) => {
	return useQuery({
		queryKey: specialtyKeys.list(params),
		queryFn: async () => extractPaginatedData(await getSpecialties(params)),
		staleTime: 1000 * 60 * 5,
	});
};

// Get active specialties (for dropdowns)
export const useActiveSpecialties = () =>
	useQuery({
		queryKey: specialtyKeys.active(),
		queryFn: async () => extractApiData(await getActiveSpecialties()),
		staleTime: 1000 * 60 * 10,
	});

// Get specialty by ID
export const useSpecialty = (id: string) =>
	useQuery({
		queryKey: specialtyKeys.detail(id),
		queryFn: async () => extractApiData(await getSpecialtyById(id)),
		enabled: !!id,
	});

// Get specialty statistics
export const useSpecialtyStats = () =>
	useQuery({
		queryKey: specialtyKeys.stats(),
		queryFn: async () => extractApiData(await getSpecialtyStats()),
		staleTime: 1000 * 60 * 5,
	});


// Create specialty mutation
export const useCreateSpecialty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateSpecialtyRequest) =>
			extractApiData(await createSpecialty(data)),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.active() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() });
		},
	});
};

// Update specialty mutation
export const useUpdateSpecialty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateSpecialtyRequest;
		}) => extractApiData(await updateSpecialty(id, data)),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.active() });
			queryClient.invalidateQueries({
				queryKey: specialtyKeys.detail(id),
			});
			queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() });
		},
	});
};

// Delete specialty mutation
export const useDeleteSpecialty = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteSpecialty(id)),
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.active() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() });
			queryClient.removeQueries({ queryKey: specialtyKeys.detail(id) });
		},
	});
};

// Toggle specialty status mutation
export const useToggleSpecialtyStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			extractApiData(await toggleSpecialtyStatus(id, isActive)),
		onSuccess: (_, { id }) => {
			queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
			queryClient.invalidateQueries({ queryKey: specialtyKeys.active() });
			queryClient.invalidateQueries({
				queryKey: specialtyKeys.detail(id),
			});
			queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() });
		},
	});
};
