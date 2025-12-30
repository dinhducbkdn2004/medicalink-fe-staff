export { Doctors } from './index'

export { DoctorProfileView } from './pages/doctor-profile-view'
export { DoctorProfileForm } from './pages/doctor-profile-form'

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

export { RichTextEditor, RichTextDisplay } from './components/rich-text-editor'
export {
  DoctorsProvider,
  useDoctors as useDoctorsContext,
} from './components/doctors-provider'

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

export {
  DoctorPermissions,
  canReadDoctors,
  canCreateDoctors,
  canUpdateDoctors,
  canDeleteDoctors,
  canManageDoctors,
  canEditDoctorProfile,
  canEditOwnProfile,
  canDeleteDoctor,
  canToggleActive,
  getDoctorActions,
  getDoctorRowActions,
} from './utils/permissions'
