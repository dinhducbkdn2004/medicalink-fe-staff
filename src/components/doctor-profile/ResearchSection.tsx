import { BookOpen } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { DoctorComplete } from "@/types/api/doctors.types";

interface ResearchSectionProps {
	doctor: DoctorComplete;
	isEditMode: boolean;
	formData: {
		research: string;
	};
	onFormChange: (field: string, value: string) => void;
}

export function ResearchSection({
	doctor,
	isEditMode,
	formData,
	onFormChange,
}: ResearchSectionProps) {
	// Don't render if no research content and not in edit mode
	if (!doctor.research && !isEditMode) {
		return null;
	}

	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<BookOpen className="h-4 w-4" />
					Research & Publications
				</CardTitle>
				<CardDescription className="text-sm">
					Research works, publications, and scientific contributions
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-4">
				{isEditMode ? (
					<div className="space-y-3">
						<Label className="font-medium">Research Content</Label>
						<Textarea
							value={formData.research}
							onChange={(e) => onFormChange("research", e.target.value)}
							placeholder="Enter research details, publications, and scientific works..."
							className="min-h-[120px]"
						/>
						<p className="text-muted-foreground text-xs">
							You can include HTML formatting for better presentation
						</p>
					</div>
				) : (
					<div className="prose prose-sm max-w-none">
						<div
							className="leading-relaxed"
							dangerouslySetInnerHTML={{ __html: doctor.research || "" }}
							style={{
								fontSize: "14px",
								lineHeight: "1.6",
							}}
						/>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
