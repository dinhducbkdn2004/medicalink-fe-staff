/**
 * Doctor Module Public Exports
 * Main export file for the doctor management module
 */

// Main page component
export { Doctors } from './index'

// Profile pages
export { DoctorProfileView } from './pages/doctor-profile-view'
export { DoctorProfileForm } from './pages/doctor-profile-form'

// Types
export type {
  DoctorAccount,
  DoctorProfile,
  DoctorWithProfile,
  CompleteDoctorData,
  DoctorListParams,
  DoctorListResponse,
  DoctorStatsResponse,
  CreateDoctorRequest,
  UpdateDoctorAccountRequest,
  UpdateDoctorProfileRequest,
  CreateDoctorFormData,
  UpdateDoctorAccountFormData,
  UpdateDoctorProfileFormData,
  Specialty,
  WorkLocation,
} from './types'

// Data hooks
export {
  useDoctors,
  useDoctor,
  useCompleteDoctor,
  useDoctorStats,
  useCreateDoctor,
  useUpdateDoctor,
  useDeleteDoctor,
  useMyDoctorProfile,
  useDoctorProfile,
  useCreateDoctorProfile,
  useUpdateMyProfile,
  useUpdateDoctorProfile,
} from './data'

// Components
export { RichTextEditor, RichTextDisplay } from './components/rich-text-editor'
export {
  DoctorsProvider,
  useDoctors as useDoctorsContext,
} from './components/doctors-provider'

// Utilities
export {
  useCloudinaryUpload,
  validateImageFile,
  getUploadSignature,
  uploadToCloudinary,
} from './utils/cloudinary'

export type {
  CloudinarySignature,
  CloudinaryUploadResult,
} from './utils/cloudinary'

// Permissions
export {
  DoctorPermissions,
  canReadDoctors,
  canManageDoctors,
  canDeleteDoctors,
  canEditOwnProfile,
  canToggleActive,
  getDoctorActions,
  DOCTOR_MANAGEMENT_ROLES,
  DOCTOR_SELF_EDIT_ROLES,
} from './utils/permissions'

export type { DoctorPermission } from './utils/permissions'
