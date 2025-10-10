import {
	GraduationCap,
	MapPin,
	Upload,
	Award,
	Stethoscope,
	Star,
	Building2,
	Users,
	Trophy,
	FileText,
	BookOpen,
	Briefcase,
	Plus,
	X,
} from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DoctorComplete } from "@/types/api/doctors.types";
import { Spinner } from "../ui/spinner";

interface ProfessionalInformationProps {
	readonly doctor: DoctorComplete;
	readonly isEditMode: boolean;
	readonly formData: {
		degree: string;
		position: string[];
		memberships: string[];
		awards: string[];
		research: string;
		trainingProcess: string[];
		experience: string[];
		portraitPreview: string;
		specialtyIds: string[];
		locationIds: string[];
	};
	readonly uploadingPortrait: boolean;
	readonly onFormChange: (field: string, value: string | string[]) => void;
	readonly onPortraitUpload: (
		event: React.ChangeEvent<HTMLInputElement>
	) => void;
	readonly portraitInputRef: React.RefObject<HTMLInputElement | null>;
}

export function ProfessionalInformation({
	doctor,
	isEditMode,
	formData,
	uploadingPortrait,
	onFormChange,
	onPortraitUpload,
	portraitInputRef,
}: ProfessionalInformationProps) {
	const addArrayItem = (field: string) => {
		const current = formData[field as keyof typeof formData] as string[];
		onFormChange(field, [...current, ""]);
	};

	const updateArrayItem = (field: string, index: number, value: string) => {
		const current = formData[field as keyof typeof formData] as string[];
		const updated = [...current];
		updated[index] = value;
		onFormChange(field, updated);
	};

	const removeArrayItem = (field: string, index: number) => {
		const current = formData[field as keyof typeof formData] as string[];
		onFormChange(
			field,
			current.filter((_, i) => i !== index)
		);
	};

	const renderArrayField = (
		title: string,
		field: string,
		icon: React.ReactNode,
		placeholder: string,
		data?: string[]
	) => {
		const editData = formData[field as keyof typeof formData] as string[];
		const displayData = isEditMode ? editData : data || [];

		if (!isEditMode && (!data || data.length === 0)) return null;

		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					{icon}
					<Label className="font-medium">{title}</Label>
				</div>
				{isEditMode ? (
					<div className="space-y-2">
						{editData.map((item, index) => (
							<div
								key={`${field}-${index}-${item.slice(0, 10)}`}
								className="flex gap-2"
							>
								<Input
									value={item}
									onChange={(e) =>
										updateArrayItem(field, index, e.target.value)
									}
									placeholder={placeholder}
									className="flex-1"
								/>
								<Button
									type="button"
									variant="ghost"
									size="icon"
									onClick={() => removeArrayItem(field, index)}
									className="h-10 w-10 text-red-500 hover:text-red-700"
								>
									<X className="h-4 w-4" />
								</Button>
							</div>
						))}
						<Button
							type="button"
							variant="outline"
							size="sm"
							onClick={() => addArrayItem(field)}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							Add {title.slice(0, -1)}
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{displayData.map((item, index) => (
							<div
								key={`${field}-display-${index}-${item.slice(0, 10)}`}
								className="bg-muted/50 rounded-lg border p-3"
							>
								<p className="text-sm">{item}</p>
							</div>
						))}
					</div>
				)}
			</div>
		);
	};
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<GraduationCap className="h-4 w-4" />
					Professional Information
				</CardTitle>
				<CardDescription className="text-sm">
					Academic credentials, specializations, and professional details
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Academic Degree Section */}
				{(doctor.degree || isEditMode) && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<Award className="h-4 w-4" />
							<Label className="font-medium">Academic Degree & Title</Label>
						</div>
						{isEditMode ? (
							<Input
								value={formData.degree}
								onChange={(e) => onFormChange("degree", e.target.value)}
								placeholder="e.g., Associate Professor, Dr., MD, PhD"
							/>
						) : (
							<div className="bg-muted/50 rounded-lg border p-3">
								<div className="flex items-center gap-3">
									<Award className="text-primary h-4 w-4" />
									<p className="text-sm font-semibold">{doctor.degree}</p>
								</div>
							</div>
						)}
					</div>
				)}

				{/* Positions */}
				{renderArrayField(
					"Current Positions",
					"position",
					<Briefcase className="h-4 w-4" />,
					"e.g., Director of Foreign Affairs",
					doctor.position
				)}

				{/* Medical Specialties */}
				{doctor.specialties && doctor.specialties.length > 0 && (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Stethoscope className="h-4 w-4" />
							<Label className="font-medium">Medical Specialties</Label>
						</div>
						<div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
							{doctor.specialties.map((specialty) => (
								<div
									key={specialty.id}
									className="bg-muted/50 flex items-center gap-3 rounded-lg border p-2.5"
								>
									<Stethoscope className="text-primary h-4 w-4" />
									<span className="text-sm font-medium">{specialty.name}</span>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Work Locations */}
				{doctor.workLocations && doctor.workLocations.length > 0 && (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Building2 className="h-4 w-4" />
							<Label className="font-medium">Work Locations</Label>
						</div>
						<div className="space-y-2">
							{doctor.workLocations.map((location) => (
								<div
									key={location.id}
									className="bg-muted/50 rounded-lg border p-3"
								>
									<div className="flex items-start gap-3">
										<MapPin className="text-primary mt-0.5 h-4 w-4" />
										<div className="flex-1 space-y-1">
											<h4 className="text-sm font-semibold">{location.name}</h4>
											<p className="text-muted-foreground text-xs">
												{location.address}
											</p>
											{location.phone && (
												<p className="text-xs font-medium">{location.phone}</p>
											)}
										</div>
									</div>
								</div>
							))}
						</div>
					</div>
				)}

				{/* Professional Memberships */}
				{renderArrayField(
					"Professional Memberships",
					"memberships",
					<Users className="h-4 w-4" />,
					"e.g., Editorial Board of the Vietnam Journal of Surgery",
					doctor.memberships
				)}

				{/* Awards & Recognition */}
				{renderArrayField(
					"Awards & Recognition",
					"awards",
					<Trophy className="h-4 w-4" />,
					"e.g., First Class Military Exploit Medal (2004)",
					doctor.awards
				)}

				{/* Research & Publications */}
				{(doctor.research || isEditMode) && (
					<div className="space-y-3">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4" />
							<Label className="font-medium">Research & Publications</Label>
						</div>
						{isEditMode ? (
							<Textarea
								value={formData.research}
								onChange={(e) => onFormChange("research", e.target.value)}
								placeholder="Enter research details, publications, and scientific works..."
								className="min-h-[100px]"
							/>
						) : (
							doctor.research && (
								<div className="bg-muted/50 rounded-lg border p-3">
									<div
										className="prose prose-sm max-w-none"
										dangerouslySetInnerHTML={{ __html: doctor.research }}
									/>
								</div>
							)
						)}
					</div>
				)}

				{/* Training Process */}
				{renderArrayField(
					"Training & Education",
					"trainingProcess",
					<BookOpen className="h-4 w-4" />,
					"e.g., 1979 – 1985: General Practitioner, Military Medical Academy",
					doctor.trainingProcess
				)}

				{/* Experience */}
				{renderArrayField(
					"Professional Experience",
					"experience",
					<Briefcase className="h-4 w-4" />,
					"e.g., July 1985-May 1987: Chief of Military Medicine",
					doctor.experience
				)}

				{/* Professional Portrait */}
				{(doctor.portrait || formData.portraitPreview || isEditMode) && (
					<div className="space-y-4">
						<div className="flex items-center gap-2">
							<Star className="h-4 w-4" />
							<Label className="font-medium">Professional Portrait</Label>
						</div>
						{isEditMode ? (
							<div className="space-y-4">
								{formData.portraitPreview && (
									<div className="flex justify-center">
										<div className="group relative">
											<img
												src={formData.portraitPreview}
												alt="Portrait preview"
												className="h-48 w-48 rounded-lg border object-cover shadow-sm"
											/>
										</div>
									</div>
								)}
								<div className="flex justify-center">
									<Button
										variant="outline"
										onClick={() => portraitInputRef.current?.click()}
										disabled={uploadingPortrait}
										className="gap-2"
									>
										<Upload className="h-4 w-4" />
										{uploadingPortrait ? (
											<Spinner size={20} className="text-primary" />
										) : (
											"Upload Professional Portrait"
										)}
									</Button>
								</div>
								<input
									ref={portraitInputRef}
									type="file"
									accept="image/*"
									onChange={onPortraitUpload}
									className="hidden"
								/>
							</div>
						) : (
							doctor.portrait && (
								<div className="flex justify-center">
									<div className="group relative">
										<img
											src={doctor.portrait}
											alt={`${doctor.fullName} portrait`}
											className="h-48 w-48 rounded-lg border object-cover shadow-sm"
										/>
									</div>
								</div>
							)
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
