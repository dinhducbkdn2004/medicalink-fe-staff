export const MESSAGES = {
	// Success Messages
	SUCCESS: {
		DOCTOR: {
			CREATED: "Doctor account created successfully",
			UPDATED: "Doctor information updated successfully",
			DELETED: "Doctor account deleted successfully",
			ACTIVATED: "Doctor account activated successfully",
			DEACTIVATED: "Doctor account deactivated successfully",
			PROFILE_UPDATED: "Doctor profile updated successfully",
			INTRODUCTION_UPDATED: "Introduction updated successfully",
			AVATAR_UPLOADED: "Avatar uploaded successfully",
			PORTRAIT_UPLOADED: "Portrait uploaded successfully",
		},
		ADMIN: {
			CREATED: "Admin account created successfully",
			UPDATED: "Admin information updated successfully",
			DELETED: "Admin account deleted successfully",
		},
		SPECIALTY: {
			CREATED: "Specialty created successfully",
			UPDATED: "Specialty updated successfully",
			DELETED: "Specialty deleted successfully",
			STATUS_UPDATED: "Specialty status updated successfully",
		},
		LOCATION: {
			CREATED: "Work location created successfully",
			UPDATED: "Work location updated successfully",
			DELETED: "Work location deleted successfully",
			STATUS_UPDATED: "Work location status updated successfully",
		},
		SCHEDULE: {
			CREATED: "Work schedule created successfully",
			UPDATED: "Work schedule updated successfully",
			DELETED: "Work schedule deleted successfully",
			STATUS_UPDATED: "Work schedule status updated successfully",
		},
		APPOINTMENT: {
			CREATED: "Appointment created successfully",
			UPDATED: "Appointment updated successfully",
			CANCELLED: "Appointment cancelled successfully",
			STATUS_UPDATED: "Appointment status updated successfully",
		},
		PASSWORD: {
			CHANGED: "Password changed successfully",
			RESET: "Password reset successfully",
		},
		GENERAL: {
			SAVED: "Saved successfully",
			UPLOADED: "Uploaded successfully",
			COPIED: "Copied successfully",
		},
	},

	// Error Messages
	ERROR: {
		DOCTOR: {
			CREATE_FAILED: "Failed to create doctor account",
			UPDATE_FAILED: "Failed to update doctor information",
			DELETE_FAILED: "Failed to delete doctor account",
			LOAD_FAILED: "Failed to load doctor information",
			TOGGLE_STATUS_FAILED: "Failed to change doctor status",
			PROFILE_UPDATE_FAILED: "Failed to update doctor profile",
			INTRODUCTION_SAVE_FAILED: "Failed to save introduction",
			AVATAR_UPLOAD_FAILED: "Failed to upload avatar",
			PORTRAIT_UPLOAD_FAILED: "Failed to upload portrait",
			PROFILE_ID_NOT_FOUND: "Profile ID not found",
		},
		ADMIN: {
			CREATE_FAILED: "Failed to create admin account",
			UPDATE_FAILED: "Failed to update admin information",
			DELETE_FAILED: "Failed to delete admin account",
			LOAD_FAILED: "Failed to load admin information",
		},
		SPECIALTY: {
			CREATE_FAILED: "Failed to create specialty",
			UPDATE_FAILED: "Failed to update specialty",
			DELETE_FAILED: "Failed to delete specialty",
			LOAD_FAILED: "Failed to load specialty list",
			STATUS_UPDATE_FAILED: "Failed to update specialty status",
		},
		LOCATION: {
			CREATE_FAILED: "Failed to create work location",
			UPDATE_FAILED: "Failed to update work location",
			DELETE_FAILED: "Failed to delete work location",
			LOAD_FAILED: "Failed to load location list",
			STATUS_UPDATE_FAILED: "Failed to update location status",
		},
		SCHEDULE: {
			CREATE_FAILED: "Failed to create schedule",
			UPDATE_FAILED: "Failed to update schedule",
			DELETE_FAILED: "Failed to delete schedule",
			LOAD_FAILED: "Failed to load schedule list",
			STATUS_UPDATE_FAILED: "Failed to update schedule status",
			SAVE_FAILED: "Failed to save schedule",
		},
		APPOINTMENT: {
			CREATE_FAILED: "Failed to create appointment",
			UPDATE_FAILED: "Failed to update appointment",
			CANCEL_FAILED: "Failed to cancel appointment",
			LOAD_FAILED: "Failed to load appointment list",
			STATUS_UPDATE_FAILED: "Failed to update appointment status",
		},
		PASSWORD: {
			CHANGE_FAILED: "Failed to change password",
			RESET_FAILED: "Failed to reset password",
		},
		GENERAL: {
			SAVE_FAILED: "Failed to save data",
			LOAD_FAILED: "Failed to load data",
			UPLOAD_FAILED: "Failed to upload file",
			NETWORK_ERROR: "Network error",
			SERVER_ERROR: "Server error",
			VALIDATION_ERROR: "Invalid data",
			UNAUTHORIZED: "Unauthorized access",
			FORBIDDEN: "Access denied",
			NOT_FOUND: "Data not found",
			TIMEOUT: "Request timeout",
		},
	},

	// Info Messages
	INFO: {
		NO_CHANGES_DETECTED: "No changes detected",
		PLEASE_WAIT: "Please wait...",
		LOADING: "Loading...",
		SAVING: "Saving...",
		UPLOADING: "Uploading...",
		PROCESSING: "Processing...",
		DELETING: "Deleting...",
		UPDATING: "Updating...",
	},

	// Warning Messages
	WARNING: {
		UNSAVED_CHANGES: "You have unsaved changes",
		CONFIRM_DELETE: "Are you sure you want to delete?",
		CONFIRM_LOGOUT: "Are you sure you want to log out?",
		SESSION_EXPIRED: "Your session has expired",
	},

	// Loading States
	LOADING: {
		DOCTOR: {
			CREATING: "Creating doctor account...",
			UPDATING: "Updating doctor information...",
			DELETING: "Deleting doctor account...",
			LOADING: "Loading doctor information...",
			SAVING_PROFILE: "Saving doctor profile...",
			SAVING_INTRODUCTION: "Saving introduction...",
			UPLOADING_AVATAR: "Uploading avatar...",
			UPLOADING_PORTRAIT: "Uploading portrait...",
		},
		ADMIN: {
			CREATING: "Creating admin account...",
			UPDATING: "Updating admin information...",
			DELETING: "Deleting admin account...",
			LOADING: "Loading admin information...",
		},
		SPECIALTY: {
			CREATING: "Creating specialty...",
			UPDATING: "Updating specialty...",
			DELETING: "Deleting specialty...",
			LOADING: "Loading specialty list...",
		},
		LOCATION: {
			CREATING: "Creating work location...",
			UPDATING: "Updating work location...",
			DELETING: "Deleting work location...",
			LOADING: "Loading location list...",
		},
		SCHEDULE: {
			CREATING: "Creating schedule...",
			UPDATING: "Updating schedule...",
			DELETING: "Deleting schedule...",
			LOADING: "Loading schedule list...",
			SAVING: "Saving schedule...",
		},
		APPOINTMENT: {
			CREATING: "Creating appointment...",
			UPDATING: "Updating appointment...",
			CANCELLING: "Cancelling appointment...",
			LOADING: "Loading appointment list...",
		},
		PASSWORD: {
			CHANGING: "Changing password...",
			RESETTING: "Resetting password...",
		},
		GENERAL: {
			SAVING: "Saving...",
			LOADING: "Loading...",
			UPLOADING: "Uploading...",
			PROCESSING: "Processing...",
		},
	},
} as const;

export type MessageType = keyof typeof MESSAGES;
export type MessageCategory = keyof typeof MESSAGES.SUCCESS;
