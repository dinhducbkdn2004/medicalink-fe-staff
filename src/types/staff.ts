/**
 * Staff Module Types
 * @deprecated This file is being phased out. Import from @/types/api instead
 *
 * Re-exporting from new organized structure for backward compatibility
 */

// Re-export from api types
export type {
	CreateStaffRequest,
	UpdateStaffRequest,
	StaffQueryParams,
	StaffStats,
} from "./api/staffs.types";

export type {
	Doctor,
	CreateDoctorRequest,
	UpdateDoctorRequest,
	DoctorProfile,
	UpdateDoctorProfileRequest,
	DoctorQueryParams,
	DoctorStats,
} from "./api/doctors.types";

export type {
	Specialty,
	InfoSection,
	CreateSpecialtyRequest,
	UpdateSpecialtyRequest,
	CreateInfoSectionRequest,
	UpdateInfoSectionRequest,
	SpecialtyQueryParams,
	SpecialtyStats,
} from "./api/specialties.types";

export type {
	WorkLocation,
	CreateWorkLocationRequest,
	UpdateWorkLocationRequest,
	WorkLocationQueryParams,
	WorkLocationStats,
} from "./api/locations.types";
