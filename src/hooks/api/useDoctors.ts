/**
 * Doctor Hooks
 * React Query hooks for doctor-related API calls
 */

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getDoctors,
	getDoctorById,
	getDoctorComplete,
	createDoctor,
	updateDoctor,
	deleteDoctor,
	changeDoctorPassword,
	getDoctorStats,
	getPublicDoctorProfiles,
	updateDoctorProfile,
	toggleDoctorProfileActive,
} from "@/api/doctors";
import type {
	CreateDoctorRequest,
	UpdateDoctorRequest,
	DoctorQueryParams,
	UpdateDoctorProfileRequest,
	DoctorProfileQueryParams,
} from "@/types/api/doctors.types";

export const doctorKeys = {
	all: ["doctors"] as const,
	lists: () => [...doctorKeys.all, "list"] as const,
	list: (params?: DoctorQueryParams) =>
		[...doctorKeys.lists(), params] as const,
	details: () => [...doctorKeys.all, "detail"] as const,
	detail: (id: string) => [...doctorKeys.details(), id] as const,
	stats: () => [...doctorKeys.all, "stats"] as const,
	profiles: () => [...doctorKeys.all, "profiles"] as const,
	profileList: (params?: DoctorProfileQueryParams) =>
		[...doctorKeys.profiles(), "list", params] as const,
};

// Get doctors with pagination and filters
export const useDoctors = (params?: DoctorQueryParams) => {
	return useQuery({
		queryKey: doctorKeys.list(params),
		queryFn: async () => {
			const response = await getDoctors(params);
			return response.data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

// Get doctor by ID
export const useDoctor = (id: string) =>
	useQuery({
		queryKey: doctorKeys.detail(id),
		queryFn: async () => {
			const response = await getDoctorById(id);
			return response.data.data;
		},
		enabled: !!id,
	});

// Get doctor with complete profile information
export const useDoctorComplete = (id: string) =>
	useQuery({
		queryKey: [...doctorKeys.detail(id), "complete"],
		queryFn: async () => {
			const response = await getDoctorComplete(id);
			return response.data.data;
		},
		enabled: !!id,
	});

// Get doctor statistics
export const useDoctorStats = () =>
	useQuery({
		queryKey: doctorKeys.stats(),
		queryFn: async () => {
			const response = await getDoctorStats();
			return response.data.data;
		},
		staleTime: 1000 * 60 * 5,
	});

// Create doctor mutation
export const useCreateDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateDoctorRequest) => {
			const response = await createDoctor(data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
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
		}) => {
			const response = await updateDoctor(id, data);
			return response.data.data;
		},
		onSuccess: (_, { id }) => {
			// Invalidate doctor lists, detail, and stats
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.detail(id) });
			queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
		},
	});
};

// Delete doctor mutation
export const useDeleteDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (id: string) => {
			const response = await deleteDoctor(id);
			return response.data.data;
		},
		onSuccess: (_, id) => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
			queryClient.removeQueries({ queryKey: doctorKeys.detail(id) });
		},
	});
};

// Change doctor password (admin function)
export const useChangeDoctorPassword = () => {
	const queryClient = useQueryClient();
	return useMutation({
		mutationFn: async ({
			userId,
			newPassword,
		}: {
			userId: string;
			newPassword: string;
		}) => {
			const response = await changeDoctorPassword(userId, newPassword);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
		},
	});
};

// ==================== Doctor Profile Hooks ====================

// Get public doctor profiles with pagination
export const usePublicDoctorProfiles = (params?: DoctorProfileQueryParams) => {
	return useQuery({
		queryKey: doctorKeys.profileList(params),
		queryFn: async () => {
			const response = await getPublicDoctorProfiles(params);
			return response.data.data;
		},
		staleTime: 1000 * 60 * 5,
	});
};

// Update doctor profile mutation
export const useUpdateDoctorProfile = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async ({
			profileId,
			data,
		}: {
			profileId: string;
			data: UpdateDoctorProfileRequest;
		}) => {
			const response = await updateDoctorProfile(profileId, data);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.profiles() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
		},
	});
};

// Toggle doctor profile active status mutation
export const useToggleDoctorProfileActive = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (profileId: string) => {
			const response = await toggleDoctorProfileActive(profileId);
			return response.data.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.profiles() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
		},
	});
};
