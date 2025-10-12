import { useState, useRef } from "react";
import {
	ContactInformation,
	DoctorProfileHeader,
	ProfessionalInformation,
	IntroductionEditor,
	AccountManagement,
	ResearchSection,
	EditableListSection,
} from "@/components/doctor-profile";
import type { DoctorComplete } from "@/types/api/doctors.types";

interface EnhancedDoctorProfileProps {
	doctor: DoctorComplete;
}

export function EnhancedDoctorProfile({ doctor }: Readonly<EnhancedDoctorProfileProps>) {
	const [isEditMode, setIsEditMode] = useState(false);
	const [isEditingIntroduction, setIsEditingIntroduction] = useState(false);
	const [uploadingAvatar, setUploadingAvatar] = useState(false);
	const [uploadingPortrait, setUploadingPortrait] = useState(false);

	const [formData, setFormData] = useState({
		fullName: doctor.fullName || "",
		email: doctor.email || "",
		phone: doctor.phone || "",
		dateOfBirth: doctor.dateOfBirth?.split("T")[0] || "",
		isMale: doctor.isMale ?? true,

		degree: doctor.degree || "",
		position: doctor.position || [],

		trainingProcess: doctor.trainingProcess || [],
		experience: doctor.experience || [],
		memberships: doctor.memberships || [],
		awards: doctor.awards || [],

		introduction: doctor.introduction || "",
		research: doctor.research || "",

		avatarPreview: doctor.avatarUrl || "",
		portraitPreview: doctor.portrait || "",
	});

	const avatarInputRef = useRef<HTMLInputElement>(null);
	const portraitInputRef = useRef<HTMLInputElement>(null);

	const handleFormChange = (
		field: string,
		value: string | boolean | string[]
	) => {
		setFormData((prev) => ({
			...prev,
			[field]: value,
		}));
	};

	const handleIntroductionChange = (content: string) => {
		setFormData((prev) => ({
			...prev,
			introduction: content,
		}));
	};

	const handleAvatarUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadingAvatar(true);
		try {
			// TODO: Implement actual upload logic
			const url = URL.createObjectURL(file);
			handleFormChange("avatarPreview", url);
		} catch (error) {
			console.error("Avatar upload failed:", error);
		} finally {
			setUploadingAvatar(false);
		}
	};

	const handlePortraitUpload = async (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = event.target.files?.[0];
		if (!file) return;

		setUploadingPortrait(true);
		try {
			// TODO: Implement actual upload logic
			const url = URL.createObjectURL(file);
			handleFormChange("portraitPreview", url);
		} catch (error) {
			console.error("Portrait upload failed:", error);
		} finally {
			setUploadingPortrait(false);
		}
	};

	const handleSave = async () => {
		try {
			// TODO: Implement API call to update doctor profile
			console.log("Saving doctor profile:", formData);
			setIsEditMode(false);
		} catch (error) {
			console.error("Save failed:", error);
		}
	};

	const handleSaveIntroduction = () => {
		// Update doctor introduction in the main form
		handleFormChange("introduction", formData.introduction);
		setIsEditingIntroduction(false);
	};

	return (
		<div className="space-y-6">
			{/* Header with avatar and basic info */}
			<DoctorProfileHeader
				doctor={doctor}
				isEditMode={isEditMode}
				formData={formData}
				uploadingAvatar={uploadingAvatar}
				onFormChange={handleFormChange}
				onAvatarUpload={handleAvatarUpload}
				avatarInputRef={avatarInputRef}
			/>

			{/* Contact Information */}
			<ContactInformation
				doctor={doctor}
				isEditMode={isEditMode}
				formData={formData}
				onFormChange={handleFormChange}
			/>

			{/* Professional Information */}
			<ProfessionalInformation
				doctor={doctor}
				isEditMode={isEditMode}
				formData={{
					degree: formData.degree,
					position: formData.position || [],
					memberships: formData.memberships || [],
					awards: formData.awards || [],
					research: formData.research || "",
					trainingProcess: formData.trainingProcess || [],
					experience: formData.experience || [],
					portraitPreview: formData.portraitPreview,
					specialtyIds: doctor.specialties?.map((s) => s.id) || [],
					locationIds: doctor.workLocations?.map((l) => l.id) || [],
				}}
				uploadingPortrait={uploadingPortrait}
				onFormChange={handleFormChange}
				onPortraitUpload={handlePortraitUpload}
				portraitInputRef={portraitInputRef}
			/>

			{/* Editable Lists Section - NEW */}
			<EditableListSection
				doctor={doctor}
				isEditMode={isEditMode}
				formData={{
					position: formData.position,
					trainingProcess: formData.trainingProcess,
					experience: formData.experience,
					memberships: formData.memberships,
					awards: formData.awards,
				}}
				onFormChange={handleFormChange}
			/>

			{/* Introduction Editor */}
			<IntroductionEditor
				doctor={{ ...doctor, introduction: formData.introduction }}
				isEditingIntroduction={isEditingIntroduction}
				introductionContent={formData.introduction}
				onToggleEditIntroduction={() =>
					setIsEditingIntroduction(!isEditingIntroduction)
				}
				onSaveIntroduction={handleSaveIntroduction}
				onIntroductionChange={handleIntroductionChange}
			/>

			{/* Research Section - NEW */}
			<ResearchSection
				doctor={doctor}
				isEditMode={isEditMode}
				formData={{ research: formData.research }}
				onFormChange={handleFormChange}
			/>

			{/* Account Management */}
			<AccountManagement isEditMode={isEditMode} />

			{/* Action Buttons */}
			{isEditMode && (
				<div className="flex justify-end gap-3">
					<button
						onClick={() => setIsEditMode(false)}
						className="rounded-md border px-4 py-2 text-sm hover:bg-gray-50"
					>
						Cancel
					</button>
					<button
						onClick={handleSave}
						className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
					>
						Save Changes
					</button>
				</div>
			)}

			{!isEditMode && (
				<div className="flex justify-end">
					<button
						onClick={() => setIsEditMode(true)}
						className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2 text-sm"
					>
						Edit Profile
					</button>
				</div>
			)}
		</div>
	);
}
