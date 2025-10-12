import { toast } from "sonner";
import { MESSAGES } from "./messages";

export class MessageHandler {
	// Success Messages
	static success = {
		doctor: {
			created: () => toast.success(MESSAGES.SUCCESS.DOCTOR.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.DOCTOR.UPDATED),
			deleted: () => toast.success(MESSAGES.SUCCESS.DOCTOR.DELETED),
			activated: () => toast.success(MESSAGES.SUCCESS.DOCTOR.ACTIVATED),
			deactivated: () => toast.success(MESSAGES.SUCCESS.DOCTOR.DEACTIVATED),
			profileUpdated: () =>
				toast.success(MESSAGES.SUCCESS.DOCTOR.PROFILE_UPDATED),
			introductionUpdated: () =>
				toast.success(MESSAGES.SUCCESS.DOCTOR.INTRODUCTION_UPDATED),
			avatarUploaded: () =>
				toast.success(MESSAGES.SUCCESS.DOCTOR.AVATAR_UPLOADED),
			portraitUploaded: () =>
				toast.success(MESSAGES.SUCCESS.DOCTOR.PORTRAIT_UPLOADED),
		},
		admin: {
			created: () => toast.success(MESSAGES.SUCCESS.ADMIN.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.ADMIN.UPDATED),
			deleted: () => toast.success(MESSAGES.SUCCESS.ADMIN.DELETED),
		},
		specialty: {
			created: () => toast.success(MESSAGES.SUCCESS.SPECIALTY.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.SPECIALTY.UPDATED),
			deleted: () => toast.success(MESSAGES.SUCCESS.SPECIALTY.DELETED),
			statusUpdated: () =>
				toast.success(MESSAGES.SUCCESS.SPECIALTY.STATUS_UPDATED),
		},
		location: {
			created: () => toast.success(MESSAGES.SUCCESS.LOCATION.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.LOCATION.UPDATED),
			deleted: () => toast.success(MESSAGES.SUCCESS.LOCATION.DELETED),
			statusUpdated: () =>
				toast.success(MESSAGES.SUCCESS.LOCATION.STATUS_UPDATED),
		},
		schedule: {
			created: () => toast.success(MESSAGES.SUCCESS.SCHEDULE.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.SCHEDULE.UPDATED),
			deleted: () => toast.success(MESSAGES.SUCCESS.SCHEDULE.DELETED),
			statusUpdated: () =>
				toast.success(MESSAGES.SUCCESS.SCHEDULE.STATUS_UPDATED),
		},
		appointment: {
			created: () => toast.success(MESSAGES.SUCCESS.APPOINTMENT.CREATED),
			updated: () => toast.success(MESSAGES.SUCCESS.APPOINTMENT.UPDATED),
			cancelled: () => toast.success(MESSAGES.SUCCESS.APPOINTMENT.CANCELLED),
			statusUpdated: () =>
				toast.success(MESSAGES.SUCCESS.APPOINTMENT.STATUS_UPDATED),
		},
		password: {
			changed: () => toast.success(MESSAGES.SUCCESS.PASSWORD.CHANGED),
			reset: () => toast.success(MESSAGES.SUCCESS.PASSWORD.RESET),
		},
		general: {
			saved: () => toast.success(MESSAGES.SUCCESS.GENERAL.SAVED),
			uploaded: () => toast.success(MESSAGES.SUCCESS.GENERAL.UPLOADED),
			copied: () => toast.success(MESSAGES.SUCCESS.GENERAL.COPIED),
		},
	};

	// Error Messages
	static error = {
		doctor: {
			createFailed: () => toast.error(MESSAGES.ERROR.DOCTOR.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.DOCTOR.UPDATE_FAILED),
			deleteFailed: () => toast.error(MESSAGES.ERROR.DOCTOR.DELETE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.DOCTOR.LOAD_FAILED),
			toggleStatusFailed: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.TOGGLE_STATUS_FAILED),
			profileUpdateFailed: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.PROFILE_UPDATE_FAILED),
			introductionSaveFailed: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.INTRODUCTION_SAVE_FAILED),
			avatarUploadFailed: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.AVATAR_UPLOAD_FAILED),
			portraitUploadFailed: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.PORTRAIT_UPLOAD_FAILED),
			profileIdNotFound: () =>
				toast.error(MESSAGES.ERROR.DOCTOR.PROFILE_ID_NOT_FOUND),
		},
		admin: {
			createFailed: () => toast.error(MESSAGES.ERROR.ADMIN.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.ADMIN.UPDATE_FAILED),
			deleteFailed: () => toast.error(MESSAGES.ERROR.ADMIN.DELETE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.ADMIN.LOAD_FAILED),
		},
		specialty: {
			createFailed: () => toast.error(MESSAGES.ERROR.SPECIALTY.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.SPECIALTY.UPDATE_FAILED),
			deleteFailed: () => toast.error(MESSAGES.ERROR.SPECIALTY.DELETE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.SPECIALTY.LOAD_FAILED),
			statusUpdateFailed: () =>
				toast.error(MESSAGES.ERROR.SPECIALTY.STATUS_UPDATE_FAILED),
		},
		location: {
			createFailed: () => toast.error(MESSAGES.ERROR.LOCATION.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.LOCATION.UPDATE_FAILED),
			deleteFailed: () => toast.error(MESSAGES.ERROR.LOCATION.DELETE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.LOCATION.LOAD_FAILED),
			statusUpdateFailed: () =>
				toast.error(MESSAGES.ERROR.LOCATION.STATUS_UPDATE_FAILED),
		},
		schedule: {
			createFailed: () => toast.error(MESSAGES.ERROR.SCHEDULE.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.SCHEDULE.UPDATE_FAILED),
			deleteFailed: () => toast.error(MESSAGES.ERROR.SCHEDULE.DELETE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.SCHEDULE.LOAD_FAILED),
			statusUpdateFailed: () =>
				toast.error(MESSAGES.ERROR.SCHEDULE.STATUS_UPDATE_FAILED),
			saveFailed: () => toast.error(MESSAGES.ERROR.SCHEDULE.SAVE_FAILED),
		},
		appointment: {
			createFailed: () => toast.error(MESSAGES.ERROR.APPOINTMENT.CREATE_FAILED),
			updateFailed: () => toast.error(MESSAGES.ERROR.APPOINTMENT.UPDATE_FAILED),
			cancelFailed: () => toast.error(MESSAGES.ERROR.APPOINTMENT.CANCEL_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.APPOINTMENT.LOAD_FAILED),
			statusUpdateFailed: () =>
				toast.error(MESSAGES.ERROR.APPOINTMENT.STATUS_UPDATE_FAILED),
		},
		password: {
			changeFailed: () => toast.error(MESSAGES.ERROR.PASSWORD.CHANGE_FAILED),
			resetFailed: () => toast.error(MESSAGES.ERROR.PASSWORD.RESET_FAILED),
		},
		general: {
			saveFailed: () => toast.error(MESSAGES.ERROR.GENERAL.SAVE_FAILED),
			loadFailed: () => toast.error(MESSAGES.ERROR.GENERAL.LOAD_FAILED),
			uploadFailed: () => toast.error(MESSAGES.ERROR.GENERAL.UPLOAD_FAILED),
			networkError: () => toast.error(MESSAGES.ERROR.GENERAL.NETWORK_ERROR),
			serverError: () => toast.error(MESSAGES.ERROR.GENERAL.SERVER_ERROR),
			validationError: () =>
				toast.error(MESSAGES.ERROR.GENERAL.VALIDATION_ERROR),
			unauthorized: () => toast.error(MESSAGES.ERROR.GENERAL.UNAUTHORIZED),
			forbidden: () => toast.error(MESSAGES.ERROR.GENERAL.FORBIDDEN),
			notFound: () => toast.error(MESSAGES.ERROR.GENERAL.NOT_FOUND),
			timeout: () => toast.error(MESSAGES.ERROR.GENERAL.TIMEOUT),
		},
	};

	// Info Messages
	static info = {
		noChangesDetected: () => toast.info(MESSAGES.INFO.NO_CHANGES_DETECTED),
		pleaseWait: () => toast.info(MESSAGES.INFO.PLEASE_WAIT),
		loading: () => toast.info(MESSAGES.INFO.LOADING),
		saving: () => toast.info(MESSAGES.INFO.SAVING),
		uploading: () => toast.info(MESSAGES.INFO.UPLOADING),
		processing: () => toast.info(MESSAGES.INFO.PROCESSING),
		deleting: () => toast.info(MESSAGES.INFO.DELETING),
		updating: () => toast.info(MESSAGES.INFO.UPDATING),
	};

	// Warning Messages
	static warning = {
		unsavedChanges: () => toast.warning(MESSAGES.WARNING.UNSAVED_CHANGES),
		confirmDelete: () => toast.warning(MESSAGES.WARNING.CONFIRM_DELETE),
		confirmLogout: () => toast.warning(MESSAGES.WARNING.CONFIRM_LOGOUT),
		sessionExpired: () => toast.warning(MESSAGES.WARNING.SESSION_EXPIRED),
	};
}

// Loading State Helpers
export const getLoadingText = {
	doctor: {
		creating: MESSAGES.LOADING.DOCTOR.CREATING,
		updating: MESSAGES.LOADING.DOCTOR.UPDATING,
		deleting: MESSAGES.LOADING.DOCTOR.DELETING,
		loading: MESSAGES.LOADING.DOCTOR.LOADING,
		savingProfile: MESSAGES.LOADING.DOCTOR.SAVING_PROFILE,
		savingIntroduction: MESSAGES.LOADING.DOCTOR.SAVING_INTRODUCTION,
		uploadingAvatar: MESSAGES.LOADING.DOCTOR.UPLOADING_AVATAR,
		uploadingPortrait: MESSAGES.LOADING.DOCTOR.UPLOADING_PORTRAIT,
	},
	admin: {
		creating: MESSAGES.LOADING.ADMIN.CREATING,
		updating: MESSAGES.LOADING.ADMIN.UPDATING,
		deleting: MESSAGES.LOADING.ADMIN.DELETING,
		loading: MESSAGES.LOADING.ADMIN.LOADING,
	},
	specialty: {
		creating: MESSAGES.LOADING.SPECIALTY.CREATING,
		updating: MESSAGES.LOADING.SPECIALTY.UPDATING,
		deleting: MESSAGES.LOADING.SPECIALTY.DELETING,
		loading: MESSAGES.LOADING.SPECIALTY.LOADING,
	},
	location: {
		creating: MESSAGES.LOADING.LOCATION.CREATING,
		updating: MESSAGES.LOADING.LOCATION.UPDATING,
		deleting: MESSAGES.LOADING.LOCATION.DELETING,
		loading: MESSAGES.LOADING.LOCATION.LOADING,
	},
	schedule: {
		creating: MESSAGES.LOADING.SCHEDULE.CREATING,
		updating: MESSAGES.LOADING.SCHEDULE.UPDATING,
		deleting: MESSAGES.LOADING.SCHEDULE.DELETING,
		loading: MESSAGES.LOADING.SCHEDULE.LOADING,
		saving: MESSAGES.LOADING.SCHEDULE.SAVING,
	},
	appointment: {
		creating: MESSAGES.LOADING.APPOINTMENT.CREATING,
		updating: MESSAGES.LOADING.APPOINTMENT.UPDATING,
		cancelling: MESSAGES.LOADING.APPOINTMENT.CANCELLING,
		loading: MESSAGES.LOADING.APPOINTMENT.LOADING,
	},
	password: {
		changing: MESSAGES.LOADING.PASSWORD.CHANGING,
		resetting: MESSAGES.LOADING.PASSWORD.RESETTING,
	},
	general: {
		saving: MESSAGES.LOADING.GENERAL.SAVING,
		loading: MESSAGES.LOADING.GENERAL.LOADING,
		uploading: MESSAGES.LOADING.GENERAL.UPLOADING,
		processing: MESSAGES.LOADING.GENERAL.PROCESSING,
	},
};
