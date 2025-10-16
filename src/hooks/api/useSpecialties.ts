import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getSpecialties,
	getActiveSpecialties,
	getSpecialtyById,
	createSpecialty,
	updateSpecialty,
	deleteSpecialty,
	getSpecialtyStats,
	getInfoSections,
	createInfoSection,
	deleteInfoSection,
} from "@/api/specialties";
import { extractApiData, extractPaginatedData } from "@/api/core/utils";
import type {
	PaginationParams,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
	SpecialtyQueryParams,
	CreateInfoSectionRequest,
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
	infoSections: (specialtyId: string) =>
		[...specialtyKeys.all, "info-sections", specialtyId] as const,
};

// Get specialties with pagination and filters
export const useSpecialties = (params?: SpecialtyQueryParams) => {
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

// Alias for consistency with other hooks
export const useSpecialtyById = useSpecialty;

// Get specialty statistics
export const useSpecialtyStats = () =>
	useQuery({
		queryKey: specialtyKeys.stats(),
		queryFn: async () => extractApiData(await getSpecialtyStats()),
		staleTime: 1000 * 60 * 5,
	});

// Get info sections for a specialty
export const useInfoSections = (specialtyId: string) =>
	useQuery({
		queryKey: specialtyKeys.infoSections(specialtyId),
		queryFn: async () => extractApiData(await getInfoSections(specialtyId)),
		enabled: !!specialtyId,
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

// Create info section mutation
export const useCreateInfoSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateInfoSectionRequest) =>
			extractApiData(await createInfoSection(data)),
		onSuccess: (_, data) => {
			queryClient.invalidateQueries({
				queryKey: specialtyKeys.infoSections(data.specialtyId),
			});
			queryClient.invalidateQueries({
				queryKey: specialtyKeys.detail(data.specialtyId),
			});
			queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() });
		},
	});
};

// Delete info section mutation
export const useDeleteInfoSection = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => await deleteInfoSection(id),
		onSuccess: () => {
			// Invalidate all related queries since we don't have specialtyId in params
			queryClient.invalidateQueries({ queryKey: specialtyKeys.all });
		},
	});
};
