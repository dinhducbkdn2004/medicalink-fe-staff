import { Mail, Phone, Calendar, User, Contact } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import type { DoctorComplete } from "@/types/api/doctors.types";

const formatDate = (dateString: string) => {
	return new Date(dateString).toLocaleDateString("en-US", {
		year: "numeric",
		month: "long",
		day: "numeric",
	});
};

interface ContactInformationProps {
	doctor: DoctorComplete;
	isEditMode: boolean;
	formData: {
		fullName: string;
		email: string;
		phone: string;
		dateOfBirth: string;
		isMale: boolean;
	};
	onFormChange: (field: string, value: string | boolean) => void;
}

export function ContactInformation({
	doctor,
	isEditMode,
	formData,
	onFormChange,
}: ContactInformationProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2 text-lg">
					<Contact className="h-5 w-5" />
					Contact Information
				</CardTitle>
				<CardDescription className="text-sm">
					Primary contact details and personal information
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<Mail className="h-4 w-4" />
						<Label className="text-sm font-medium">Email Address</Label>
					</div>
					{isEditMode ? (
						<Input
							type="email"
							value={formData.email}
							onChange={(e) => onFormChange("email", e.target.value)}
							placeholder="doctor@medicalink.com"
						/>
					) : (
						<div className="bg-muted/50 rounded-lg border p-3">
							<p className="text-base font-medium">{doctor.email}</p>
						</div>
					)}
				</div>

				{/* Phone */}
				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<Phone className="h-4 w-4" />
						<Label className="text-sm font-medium">Phone Number</Label>
					</div>
					{isEditMode ? (
						<Input
							type="tel"
							value={formData.phone}
							onChange={(e) => onFormChange("phone", e.target.value)}
							placeholder="+84 123 456 789"
						/>
					) : (
						<div
							className={`rounded-lg border p-3 ${doctor.phone ? "bg-muted/50" : "border-orange-200 bg-orange-50"}`}
						>
							<p
								className={`text-base font-medium ${doctor.phone ? "text-muted-foreground" : "text-orange-600 italic"}`}
							>
								{doctor.phone || "⚠️ Cần bổ sung số điện thoại"}
							</p>
						</div>
					)}
				</div>

				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<Calendar className="h-4 w-4" />
						<Label className="text-sm font-medium">Date of Birth</Label>
					</div>
					{isEditMode ? (
						<Input
							type="date"
							value={formData.dateOfBirth}
							onChange={(e) => onFormChange("dateOfBirth", e.target.value)}
						/>
					) : (
						<div
							className={`rounded-lg border p-3 ${doctor.dateOfBirth ? "bg-muted/50" : "border-orange-200 bg-orange-50"}`}
						>
							<p
								className={`text-base font-medium ${doctor.dateOfBirth ? "text-muted-foreground" : "text-orange-600 italic"}`}
							>
								{doctor.dateOfBirth
									? formatDate(doctor.dateOfBirth)
									: "⚠️ Cần bổ sung ngày sinh"}
							</p>
						</div>
					)}
				</div>

				{/* Gender */}
				<div>
					<div className="mb-1.5 flex items-center gap-2">
						<User className="h-4 w-4" />
						<Label className="text-sm font-medium">Gender</Label>
					</div>
					{isEditMode ? (
						<Select
							value={formData.isMale ? "true" : "false"}
							onValueChange={(value) =>
								onFormChange("isMale", value === "true")
							}
						>
							<SelectTrigger>
								<SelectValue placeholder="Select gender" />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="true">Male</SelectItem>
								<SelectItem value="false">Female</SelectItem>
							</SelectContent>
						</Select>
					) : (
						<div className="bg-muted/50 rounded-lg border p-3">
							<p className="text-muted-foreground text-base font-medium">
								{doctor.isMale !== null && doctor.isMale !== undefined
									? doctor.isMale
										? "Nam"
										: "Nữ"
									: "Chưa cung cấp"}
							</p>
						</div>
					)}
				</div>

				{/* Full Name (in edit mode) */}
				{isEditMode && (
					<div>
						<div className="mb-1.5 flex items-center gap-2">
							<User className="h-4 w-4" />
							<Label className="text-sm font-medium">Full Name</Label>
						</div>
						<Input
							type="text"
							value={formData.fullName}
							onChange={(e) => onFormChange("fullName", e.target.value)}
							placeholder="Dr. John Doe"
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
