import React from "react";
import {
	Camera,
	Stethoscope,
	Upload,
	Power,
	MapPin,
	GraduationCap,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DoctorComplete } from "@/types/api/doctors.types";

interface DoctorProfileHeaderProps {
	doctor: DoctorComplete;
	isEditMode: boolean;
	formData: {
		fullName: string;
		avatarPreview: string;
		email: string;
		phone: string;
		dateOfBirth: string;
		isMale: boolean;
		portraitPreview: string;
	};
	uploadingAvatar: boolean;
	onFormChange: (field: string, value: string | boolean) => void;
	onAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => void;
	avatarInputRef: React.RefObject<HTMLInputElement | null>;
}

export function DoctorProfileHeader({
	doctor,
	isEditMode,
	formData,
	uploadingAvatar,
	onFormChange,
	onAvatarUpload,
	avatarInputRef,
}: DoctorProfileHeaderProps) {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((word) => word.charAt(0))
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="bg-card relative overflow-hidden rounded-lg border shadow-sm">
			<div className="relative px-4 py-4">
				<div className="mb-4 flex items-start justify-between">
					<div className="relative">
						<Avatar className="border-background h-16 w-16 border-4 shadow-lg">
							<AvatarImage
								src={formData.avatarPreview || doctor.avatarUrl}
								alt={doctor.fullName}
								className="object-cover"
							/>
							<AvatarFallback className="bg-primary text-primary-foreground text-lg font-bold">
								{getInitials(doctor.fullName)}
							</AvatarFallback>
						</Avatar>

						{isEditMode && (
							<div className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-full bg-black/50 opacity-0 transition-all hover:opacity-100">
								<button
									onClick={() => avatarInputRef.current?.click()}
									disabled={uploadingAvatar}
									className="flex h-full w-full items-center justify-center rounded-full"
								>
									{uploadingAvatar ? (
										<div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
									) : (
										<Camera className="h-5 w-5 text-white" />
									)}
								</button>
								<input
									ref={avatarInputRef}
									type="file"
									accept="image/*"
									onChange={onAvatarUpload}
									className="hidden"
								/>
							</div>
						)}
					</div>

					{/* Upload button for edit mode */}
					{isEditMode && (
						<Button
							variant="outline"
							size="sm"
							onClick={() => avatarInputRef.current?.click()}
							disabled={uploadingAvatar}
							className="gap-2"
						>
							<Upload className="h-4 w-4" />
							{uploadingAvatar ? "Uploading..." : "Add photo"}
						</Button>
					)}
				</div>

				<div className="space-y-2">
					<div className="space-y-1">
						{isEditMode ? (
							<Input
								type="text"
								value={formData.fullName}
								onChange={(e) => onFormChange("fullName", e.target.value)}
								className="border-0 border-b bg-transparent px-0 py-1 text-lg font-semibold focus-visible:ring-0"
								placeholder="Full Name"
							/>
						) : (
							<h1 className="text-lg font-semibold">{doctor.fullName}</h1>
						)}

						{doctor.degree && (
							<div className="text-muted-foreground flex items-center gap-2">
								<GraduationCap className="h-4 w-4" />
								<span className="text-sm font-medium">{doctor.degree}</span>
							</div>
						)}
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<Badge variant="secondary" className="gap-1.5">
							<Stethoscope className="h-3.5 w-3.5" />
							Medical Doctor
						</Badge>

						{doctor.isActive !== undefined && (
							<Badge
								variant={doctor.isActive ? "default" : "destructive"}
								className="gap-1.5"
							>
								<Power className="h-3.5 w-3.5" />
								{doctor.isActive ? "Active" : "Inactive"}
							</Badge>
						)}
					</div>

					{doctor.workLocations && doctor.workLocations.length > 0 && (
						<div className="text-muted-foreground flex items-center gap-2">
							<MapPin className="h-4 w-4" />
							{doctor.workLocations?.[0] && (
								<span className="text-sm">
									{doctor.workLocations[0].name}
									{doctor.workLocations.length > 1 &&
										` +${doctor.workLocations.length - 1} more`}
								</span>
							)}
						</div>
					)}

					<div className="grid grid-cols-3 gap-3 border-t pt-3">
						<div className="text-center">
							<div className="text-primary text-base font-semibold">
								{doctor.specialties?.length || 0}
							</div>
							<div className="text-muted-foreground text-xs">Specialties</div>
						</div>
						<div className="text-center">
							<div className="text-primary text-base font-semibold">
								{doctor.workLocations?.length || 0}
							</div>
							<div className="text-muted-foreground text-xs">Locations</div>
						</div>
						<div className="text-center">
							<div className="text-primary text-base font-semibold">
								{doctor.experience?.length || 0}
							</div>
							<div className="text-muted-foreground text-xs">Years Exp.</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
