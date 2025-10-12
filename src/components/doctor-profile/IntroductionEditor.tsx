/**
 * Introduction Editor Component - LinkedIn Style
 * Clean QuillJS editor with professional styling and better UX
 */

import { useRef, useEffect, useMemo, useCallback } from "react";
import { FileText, Save, Edit3, Type } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Quill from "quill";
import "quill/dist/quill.snow.css";
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
	const quillRef = useRef<HTMLDivElement>(null);
	const quillInstanceRef = useRef<Quill | null>(null);
	const onChangeRef = useRef(onIntroductionChange);

	// Keep the callback ref updated
	useEffect(() => {
		onChangeRef.current = onIntroductionChange;
	}, [onIntroductionChange]);

	// Memoize toolbar configuration to prevent re-initialization
	const toolbarConfig = useMemo(
		() => [
			[{ header: [2, 3, false] }],
			["bold", "italic", "underline"],
			[{ list: "ordered" }, { list: "bullet" }],
			["blockquote", "link"],
			["clean"],
		],
		[]
	);

	const formats = useMemo(
		() => [
			"header",
			"bold",
			"italic",
			"underline",
			"list",
			"blockquote",
			"link",
		],
		[]
	);

	// Cleanup function to properly destroy Quill instance
	const cleanupQuill = useCallback(() => {
		if (quillInstanceRef.current) {
			try {
				// Remove all event listeners
				quillInstanceRef.current.off("text-change");
				// Clear the editor content
				quillInstanceRef.current.setText("");
				// Set to null
				quillInstanceRef.current = null;
			} catch (_error) {
				// Ignore cleanup errors
				quillInstanceRef.current = null;
			}
		}

		// Clear the DOM completely
		if (quillRef.current) {
			quillRef.current.innerHTML = "";
		}
	}, []);

	useEffect(() => {
		// Always cleanup first to prevent multiple instances
		cleanupQuill();

		if (isEditingIntroduction && quillRef.current) {
			// Small delay to ensure DOM is ready
			const timeout = setTimeout(() => {
				if (quillRef.current && !quillInstanceRef.current) {
					quillInstanceRef.current = new Quill(quillRef.current, {
						theme: "snow",
						modules: {
							toolbar: {
								container: toolbarConfig,
								handlers: {},
							},
						},
						placeholder: `Tell patients about ${doctor.fullName}'s expertise, experience, and approach to care...`,
						formats: formats,
					});

					// Set initial content
					if (introductionContent) {
						quillInstanceRef.current.root.innerHTML = introductionContent;
					}

					// Listen for content changes
					quillInstanceRef.current.on("text-change", () => {
						const content = quillInstanceRef.current?.root.innerHTML || "";
						onChangeRef.current(content);
					});

					// Apply custom styling
					const toolbar = quillRef.current?.querySelector(
						".ql-toolbar"
					) as HTMLElement;
					const editor = quillRef.current?.querySelector(
						".ql-editor"
					) as HTMLElement;

					if (toolbar) {
						toolbar.style.borderRadius = "0.75rem 0.75rem 0 0";
					}

					if (editor) {
						editor.style.borderRadius = "0 0 0.75rem 0.75rem";
						editor.style.minHeight = "150px";
						editor.style.fontSize = "14px";
						editor.style.lineHeight = "1.6";
					}
				}
			}, 100);

			return () => {
				clearTimeout(timeout);
				cleanupQuill();
			};
		}

		return cleanupQuill;
	}, [isEditingIntroduction, toolbarConfig, formats, cleanupQuill]);

	// Separate effect to update content when it changes externally
	useEffect(() => {
		if (
			quillInstanceRef.current &&
			isEditingIntroduction &&
			introductionContent
		) {
			const currentContent = quillInstanceRef.current.root.innerHTML;
			if (currentContent !== introductionContent) {
				const selection = quillInstanceRef.current.getSelection();
				quillInstanceRef.current.root.innerHTML = introductionContent;
				if (selection) {
					quillInstanceRef.current.setSelection(selection);
				}
			}
		}
	}, [introductionContent, isEditingIntroduction]);

	// Cleanup on component unmount
	useEffect(() => {
		return () => {
			cleanupQuill();
		};
	}, [cleanupQuill]);

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
								variant="outline"
								onClick={onToggleEditIntroduction}
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
			<CardContent className="pt-6">
				{isEditingIntroduction ? (
					<div className="space-y-4">
						<div ref={quillRef} className="overflow-hidden rounded-lg border" />
						<div className="bg-muted text-muted-foreground flex items-center gap-2 rounded-lg p-3 text-sm">
							<Type className="h-4 w-4" />
							<span>
								Use the toolbar above to format your introduction professionally
							</span>
						</div>
					</div>
				) : (
					<div className="space-y-4">
						{doctor.introduction ? (
							<div className="prose prose-sm max-w-none">
								<div
									className="leading-relaxed"
									dangerouslySetInnerHTML={{ __html: doctor.introduction }}
									style={{
										fontSize: "14px",
										lineHeight: "1.6",
									}}
								/>
							</div>
						) : (
							<div className="rounded-lg border-2 border-dashed py-12 text-center">
								<div className="mx-auto max-w-sm space-y-4">
									<div className="bg-muted mx-auto w-fit rounded-full p-3">
										<FileText className="text-muted-foreground h-8 w-8" />
									</div>
									<div>
										<p className="font-medium">No introduction yet</p>
										<p className="text-muted-foreground mt-1 text-sm">
											Click "Edit" to add your professional introduction and
											share your expertise with patients
										</p>
									</div>
									<Button
										variant="outline"
										onClick={onToggleEditIntroduction}
										size="sm"
										className="gap-2"
									>
										<Edit3 className="h-4 w-4" />
										Add Introduction
									</Button>
								</div>
							</div>
						)}
					</div>
				)}
			</CardContent>
		</Card>
	);
}
