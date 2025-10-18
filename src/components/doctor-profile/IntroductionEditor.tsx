/**
 * Introduction Editor Component - Enhanced with Image Upload
 * Uses enhanced QuillJS editor with proper lifecycle management
 */

import { useRef, useState, useCallback } from "react";
import { FileText, Save, Edit3, ImageIcon } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
	EnhancedRichTextEditor,
	type EnhancedRichTextEditorRef,
	defaultImageUpload,
} from "@/components/ui/enhanced-rich-text-editor";
import "@/styles/quill-custom.css";

interface IntroductionEditorProps {
	doctor: {
		fullName: string;
		introduction?: string;
	};
	isEditingIntroduction: boolean;
	introductionContent: string;
	onToggleEditIntroduction: () => void;
	onSaveIntroduction: () => void;
	onIntroductionChange: (content: string) => void;
}

export function IntroductionEditor({
	doctor,
	isEditingIntroduction,
	introductionContent,
	onToggleEditIntroduction,
	onSaveIntroduction,
	onIntroductionChange,
}: IntroductionEditorProps) {
	const editorRef = useRef<EnhancedRichTextEditorRef>(null);
	const [wordCount, setWordCount] = useState(0);

	// Handle content changes - memoized to prevent re-initialization
	const handleContentChange = useCallback(
		(html: string, text: string) => {
			onIntroductionChange(html);
			setWordCount(text.trim() ? text.trim().split(/\s+/).length : 0);
		},
		[onIntroductionChange]
	);

	// Custom image upload handler - memoized to prevent re-initialization
	const handleImageUpload = useCallback(async (file: File): Promise<string> => {
		// TODO: Replace with actual API call to upload image
		try {
			return await defaultImageUpload(file);
		} catch (error) {
			console.error("Image upload failed:", error);
			throw error;
		}
	}, []);

	return (
		<Card>
			<CardHeader className="pb-3">
				<div className="flex items-center justify-between">
					<div>
						<CardTitle className="flex items-center gap-2 text-base">
							<FileText className="h-5 w-5" />
							Professional Introduction
						</CardTitle>
						<CardDescription className="mt-1 text-sm">
							Share your expertise, experience, and approach to patient care
						</CardDescription>
					</div>
					<div className="flex gap-2">
						{isEditingIntroduction ? (
							<>
								<Button
									onClick={onSaveIntroduction}
									size="sm"
									className="gap-2"
								>
									<Save className="h-4 w-4" />
									Save
								</Button>
								<Button
									variant="outline"
									onClick={onToggleEditIntroduction}
									size="sm"
								>
									Cancel
								</Button>
							</>
						) : (
							<Button
								onClick={onToggleEditIntroduction}
								variant="outline"
								size="sm"
								className="gap-2"
							>
								<Edit3 className="h-4 w-4" />
								Edit
							</Button>
						)}
					</div>
				</div>
			</CardHeader>
			<CardContent>
				{isEditingIntroduction ? (
					<div className="space-y-4">
						<EnhancedRichTextEditor
							ref={editorRef}
							value={introductionContent}
							onChange={handleContentChange}
							placeholder={`Tell patients about ${doctor.fullName}'s expertise, experience, and approach to care...`}
							minHeight="200px"
							onImageUpload={handleImageUpload}
							className="w-full"
						/>
						{wordCount > 0 && (
							<div className="text-muted-foreground flex items-center justify-between text-sm">
								<span className="flex items-center gap-1">
									<ImageIcon className="h-3 w-3" />
									Images supported • Max 5MB per file
								</span>
								<span>{wordCount} words</span>
							</div>
						)}
					</div>
				) : (
					<div className="space-y-4">
						{introductionContent ? (
							<div
								className="prose prose-sm max-w-none"
								dangerouslySetInnerHTML={{ __html: introductionContent }}
							/>
						) : (
							<div className="text-muted-foreground py-8 text-center">
								<FileText className="mx-auto mb-4 h-12 w-12 opacity-50" />
								<p className="mb-2 text-lg font-medium">No introduction yet</p>
								<p className="mb-4 text-sm">
									Share {doctor.fullName}'s professional background and
									expertise
								</p>
								<Button
									onClick={onToggleEditIntroduction}
									variant="outline"
									className="gap-2"
								>
									<Edit3 className="h-4 w-4" />
									Add Introduction
								</Button>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
