import { apiClient } from "./core/client";
import type {
	Doctor,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	PaginationParams,
	PaginatedResponse,
	ApiResponse,
} from "@/types";

// Get all doctors with pagination and filters
export const getDoctors = (
	params?: PaginationParams & {
		specialtyId?: string;
		locationId?: string;
		isAvailable?: boolean;
		search?: string;
		email?: string;
		isMale?: boolean;
		createdFrom?: string;
		createdTo?: string;
		skip?: number; // API uses skip instead of page
	}
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>("/doctors", {
		params,
	});

// Get doctor by ID
export const getDoctorById = (id: string) =>
	apiClient.get<ApiResponse<Doctor>>(`/doctors/${id}`);

// Create new doctor
export const createDoctor = (data: CreateDoctorRequest) =>
	apiClient.post<ApiResponse<Doctor>>("/doctors", data);

// Update doctor
export const updateDoctor = (id: string, data: UpdateDoctorRequest) =>
	apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}`, data);

// Delete doctor (soft delete)
export const deleteDoctor = (id: string) =>
	apiClient.delete<ApiResponse<{ message: string }>>(`/doctors/${id}`);

// Change doctor password (admin function)
export const changeDoctorPassword = (id: string, newPassword: string) =>
	apiClient.patch<ApiResponse<{ message: string }>>(`/doctors/${id}`, {
		password: newPassword,
	});

// Toggle doctor availability
export const toggleDoctorAvailability = (id: string, isAvailable: boolean) =>
	apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}/availability`, {
		isAvailable,
	});

// Activate/Deactivate doctor
export const toggleDoctorStatus = (id: string, isActive: boolean) =>
	apiClient.patch<ApiResponse<Doctor>>(`/doctors/${id}/status`, {
		isActive,
	});

// Get doctors by specialty
export const getDoctorsBySpecialty = (
	specialtyId: string,
	params?: PaginationParams
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>(
		`/doctors/specialty/${specialtyId}`,
		{
			params,
		}
	);

// Get doctors by location
export const getDoctorsByLocation = (
	locationId: string,
	params?: PaginationParams
) =>
	apiClient.get<ApiResponse<PaginatedResponse<Doctor>>>(
		`/doctors/location/${locationId}`,
		{
			params,
		}
	);

// Get doctor statistics
export const getDoctorStats = () =>
	apiClient.get<
		ApiResponse<{
			total: number;
			active: number;
			available: number;
			bySpecialty: Array<{
				specialtyId: string;
				specialtyName: string;
				count: number;
			}>;
			byLocation: Array<{
				locationId: string;
				locationName: string;
				count: number;
			}>;
		}>
	>("/doctors/stats");
