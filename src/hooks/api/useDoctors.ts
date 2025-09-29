import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
	getDoctors,
	getDoctorById,
	createDoctor,
	updateDoctor,
	deleteDoctor,
	changeDoctorPassword,
	getDoctorStats,
} from "@/api/doctors";
import type { CreateDoctorRequest, UpdateDoctorRequest } from "@/types";

// Query keys
export const doctorKeys = {
	all: ["doctors"] as const,
	lists: () => [...doctorKeys.all, "list"] as const,
	list: (params?: {
		page?: number;
		limit?: number;
		search?: string;
		email?: string;
		isMale?: boolean;
		createdFrom?: string;
		createdTo?: string;
		sortBy?: "createdAt" | "fullName" | "email";
		sortOrder?: "asc" | "desc";
	}) => [...doctorKeys.lists(), params] as const,
	details: () => [...doctorKeys.all, "detail"] as const,
	detail: (id: string) => [...doctorKeys.details(), id] as const,
	stats: () => [...doctorKeys.all, "stats"] as const,
};

/**
 * Doctor Query Hooks
 */

// Get doctors with pagination and filters
export const useDoctors = (params?: {
	page?: number;
	limit?: number;
	search?: string;
	email?: string;
	isMale?: boolean;
	createdFrom?: string;
	createdTo?: string;
	sortBy?: "createdAt" | "fullName" | "email";
	sortOrder?: "asc" | "desc";
}) => {
	return useQuery({
		queryKey: doctorKeys.list(params),
		queryFn: async () => {
			const response = await getDoctors(params);
			return response.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});
};

// Get doctor by ID
export const useDoctor = (id: string) =>
	useQuery({
		queryKey: doctorKeys.detail(id),
		queryFn: async () => {
			const response = await getDoctorById(id);
			return response.data;
		},
		enabled: !!id,
	});

// Get doctor statistics
export const useDoctorStats = () =>
	useQuery({
		queryKey: doctorKeys.stats(),
		queryFn: async () => {
			const response = await getDoctorStats();
			return response.data;
		},
		staleTime: 1000 * 60 * 5, // 5 minutes
	});

/**
 * Doctor Mutation Hooks
 */

// Create doctor mutation
export const useCreateDoctor = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: async (data: CreateDoctorRequest) => {
			const response = await createDoctor(data);
			return response.data;
		},
		onSuccess: () => {
			// Invalidate doctor lists and stats
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
			return response.data;
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
			return response.data;
		},
		onSuccess: (_, id) => {
			// Invalidate doctor lists and stats
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
			queryClient.invalidateQueries({ queryKey: doctorKeys.stats() });
			// Remove detail from cache
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
			return response.data;
		},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: doctorKeys.lists() });
		},
	});
};
