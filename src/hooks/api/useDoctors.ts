import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getDoctors,
	getDoctorById,
	createDoctor,
	updateDoctor,
	deleteDoctor,
	toggleDoctorAvailability,
	toggleDoctorStatus,
	getDoctorsBySpecialty,
	getDoctorsByLocation,
	getDoctorStats,
} from "@/api/doctors";
import { extractApiData } from "@/api/client";
import type {
	PaginationParams,
	CreateDoctorRequest,
	UpdateDoctorRequest,
} from "@/types/api";

// Query keys
export const doctorKeys = {
	all: ["doctors"] as const,
	lists: () => [...doctorKeys.all, "list"] as const,
	list: (
		params?: PaginationParams & {
			specialtyId?: string;
			locationId?: string;
			isAvailable?: boolean;
			search?: string;
		}
	) => [...doctorKeys.lists(), params] as const,
	details: () => [...doctorKeys.all, "detail"] as const,
	detail: (id: string) => [...doctorKeys.details(), id] as const,
	bySpecialty: (specialtyId: string, params?: PaginationParams) =>
		[...doctorKeys.all, "specialty", specialtyId, params] as const,
	byLocation: (locationId: string, params?: PaginationParams) =>
		[...doctorKeys.all, "location", locationId, params] as const,
	stats: () => [...doctorKeys.all, "stats"] as const,
};

/**
 * Doctor Query Hooks
 */

// Get doctors with pagination and filters
export const useDoctors = (
	params?: PaginationParams & {
		specialtyId?: string;
		locationId?: string;
		isAvailable?: boolean;
		search?: string;
	}
) =>
	useQuery({
		queryKey: doctorKeys.list(params),
		queryFn: async () => extractApiData(await getDoctors(params)),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

// Get doctor by ID
export const useDoctor = (id: string) =>
	useQuery({
		queryKey: doctorKeys.detail(id),
		queryFn: async () => extractApiData(await getDoctorById(id)),
		enabled: !!id,
	});

// Get doctors by specialty
export const useDoctorsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	useQuery({
		queryKey: doctorKeys.bySpecialty(specialtyId, params),
		queryFn: async () =>
			extractApiData(await getDoctorsBySpecialty(specialtyId, params)),
		enabled: !!specialtyId,
	});

// Get doctors by location
export const useDoctorsByLocation = (
	locationId: string,
	params?: PaginationParams
) =>
	useQuery({
		queryKey: doctorKeys.byLocation(locationId, params),
		queryFn: async () =>
			extractApiData(await getDoctorsByLocation(locationId, params)),
		enabled: !!locationId,
	});

// Get doctor statistics
export const useDoctorStats = () =>
	useQuery({
		queryKey: doctorKeys.stats(),
		queryFn: async () => extractApiData(await getDoctorStats()),
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Doctor Mutation Hooks
 */

// Create doctor mutation
export const useCreateDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateDoctorRequest) =>
			extractApiData(await createDoctor(data)),
		onSuccess: () => {
			// Invalidate doctor lists and stats
			void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
		},
	});
};

// Update doctor mutation
export const useUpdateDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			data,
		}: {
			id: string;
			data: UpdateDoctorRequest;
		}) => extractApiData(await updateDoctor(id, data)),
		onSuccess: (_, { id }) => {
			// Invalidate doctor lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
		},
	});
};

// Delete doctor mutation
export const useDeleteDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => extractApiData(await deleteDoctor(id)),
		onSuccess: (_, id) => {
			// Invalidate doctor lists and stats
			void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
			// Remove detail from cache
			void queryClient.removeQueries({ queryKey: doctorKeys.detail(id) });
		},
	});
};

// Toggle doctor availability mutation
export const useToggleDoctorAvailability = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			id,
			isAvailable,
		}: {
			id: string;
			isAvailable: boolean;
		}) => extractApiData(await toggleDoctorAvailability(id, isAvailable)),
		onSuccess: (_, { id }) => {
			// Invalidate doctor lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
		},
	});
};

// Toggle doctor status mutation
export const useToggleDoctorStatus = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) =>
			extractApiData(await toggleDoctorStatus(id, isActive)),
		onSuccess: (_, { id }) => {
			// Invalidate doctor lists, detail, and stats
			void queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
			void queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
		},
	});
};
