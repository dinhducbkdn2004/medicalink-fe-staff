import {
	Plus,
	GraduationCap,
	Briefcase,
	Award,
	Star,
	Trash2,
} from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import type { DoctorComplete } from "@/types/api/doctors.types";
import { useCallback, useRef } from "react";

interface EditableListSectionProps {
	doctor: DoctorComplete;
	isEditMode: boolean;
	formData: {
		position: string[];
		trainingProcess: string[];
		experience: string[];
		memberships: string[];
		awards: string[];
	};
	onFormChange: (field: string, value: string[]) => void;
}

export function EditableListSection({
	doctor,
	isEditMode,
	formData,
	onFormChange,
}: Readonly<EditableListSectionProps>) {
	const newItemRefs = useRef<{ [key: string]: HTMLTextAreaElement | null }>({});

	const addItem = useCallback(
		(field: keyof typeof formData) => {
			const currentList = formData[field];
			onFormChange(field, [...currentList, ""]);

			// Focus the new input after it's rendered
			setTimeout(() => {
				const newIndex = currentList.length;
				const inputKey = `${field}-${newIndex}`;
				const inputElement = newItemRefs.current[inputKey];
				if (inputElement) {
					inputElement.focus();
				}
			}, 100);
		},
		[formData, onFormChange]
	);

	const removeItem = useCallback(
		(field: keyof typeof formData, index: number) => {
			const currentList = formData[field];
			const newList = currentList.filter((_, i) => i !== index);
			onFormChange(field, newList);
		},
		[formData, onFormChange]
	);

	const updateItem = useCallback(
		(field: keyof typeof formData, index: number, value: string) => {
			const currentList = formData[field];
			const newList = [...currentList];
			newList[index] = value;
			onFormChange(field, newList);
		},
		[formData, onFormChange]
	);

	const renderListSection = (
		title: string,
		icon: React.ReactNode,
		field: keyof typeof formData,
		placeholder: string,
		doctorData: string[] | undefined
	) => {
		const hasData = doctorData && doctorData.length > 0;
		const showSection = hasData || isEditMode;

		if (!showSection) return null;

		return (
			<div className="space-y-3">
				<div className="flex items-center gap-2">
					{icon}
					<Label className="font-medium">{title}</Label>
				</div>

				{isEditMode ? (
					<div className="space-y-3">
						{formData[field].map((item, index) => {
							const inputKey = `${field}-${index}`;
							return (
								<div key={inputKey} className="flex gap-2">
									<Textarea
										ref={(el) => {
											newItemRefs.current[inputKey] = el;
										}}
										value={item}
										onChange={(e) => updateItem(field, index, e.target.value)}
										placeholder={placeholder}
										className="min-h-[80px] flex-1 resize-none"
										rows={3}
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => removeItem(field, index)}
										className="shrink-0 px-2"
									>
										<Trash2 className="h-4 w-4" />
									</Button>
								</div>
							);
						})}
						<Button
							variant="outline"
							onClick={() => addItem(field)}
							className="gap-2"
						>
							<Plus className="h-4 w-4" />
							Add {title.split(" ")[0]}
						</Button>
					</div>
				) : (
					<div className="space-y-2">
						{doctorData?.map((item, index) => (
							<div
								key={`${field}-view-${index}-${item.slice(0, 20)}`}
								className="bg-muted/50 rounded-lg border p-3"
							>
								<p className="text-sm leading-relaxed">{item}</p>
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
				<CardTitle className="text-base">Professional Details</CardTitle>
				<CardDescription className="text-sm">
					Additional professional information and career details
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{renderListSection(
					"Position & Title",
					<Briefcase className="h-4 w-4" />,
					"position",
					"Enter position or title",
					doctor.position
				)}

				{renderListSection(
					"Training Process",
					<GraduationCap className="h-4 w-4" />,
					"trainingProcess",
					"Enter training or education details",
					doctor.trainingProcess
				)}

				{renderListSection(
					"Professional Experience",
					<Briefcase className="h-4 w-4" />,
					"experience",
					"Enter professional experience",
					doctor.experience
				)}

				{renderListSection(
					"Professional Memberships",
					<Award className="h-4 w-4" />,
					"memberships",
					"Enter membership details",
					doctor.memberships
				)}

				{renderListSection(
					"Awards & Recognition",
					<Star className="h-4 w-4" />,
					"awards",
					"Enter award or recognition",
					doctor.awards
				)}
			</CardContent>
		</Card>
	);
}
