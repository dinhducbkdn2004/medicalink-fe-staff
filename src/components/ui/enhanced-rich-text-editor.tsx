/**
 * Enhanced Rich Text Editor Component using QuillJS
 * Features:
 * - Advanced toolbar with image upload
 * - Proper lifecycle management to prevent duplicate instances
 * - Custom image handler with upload functionality
 * - Professional styling
 */

import {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useCallback,
	useMemo,
	useState,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Upload } from "lucide-react";

interface EnhancedRichTextEditorProps {
	value?: string;
	onChange?: (html: string, text: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
	minHeight?: string;
	maxFileSize?: number; // in MB
	allowedFileTypes?: string[];
	onImageUpload?: (file: File) => Promise<string>; // Returns image URL
	onVideoUpload?: (file: File) => Promise<string>; // Returns video URL
	allowedVideoTypes?: string[];
}

export interface EnhancedRichTextEditorRef {
	getQuill: () => Quill | null;
	focus: () => void;
	blur: () => void;
	clear: () => void;
	getHTML: () => string;
	getText: () => string;
	setHTML: (html: string) => void;
}

export const EnhancedRichTextEditor = forwardRef<
	EnhancedRichTextEditorRef,
	EnhancedRichTextEditorProps
>(
	(
		{
			value = "",
			onChange,
			placeholder = "Write something amazing...",
			readOnly = false,
			className,
			minHeight = "300px",
			maxFileSize = 5, // 5MB default
			allowedFileTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"],
			onImageUpload,
			onVideoUpload,
			allowedVideoTypes = ["video/mp4", "video/webm", "video/ogg"],
		},
		ref
	) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const quillRef = useRef<Quill | null>(null);
		const isUpdatingContent = useRef(false);
		const isInitialized = useRef(false);
		const mountedRef = useRef(true);
		const onChangeRef = useRef(onChange);
		const valueRef = useRef(value);
		const [isUploading, setIsUploading] = useState(false);

		// Update refs when props change
		useEffect(() => {
			onChangeRef.current = onChange;
			valueRef.current = value;
		});

		// Advanced toolbar configuration
		const toolbarConfig = useMemo(
			() => [
				// Text formatting
				[{ font: [] }],
				[{ size: ["small", false, "large", "huge"] }],
				[{ header: [1, 2, 3, 4, 5, 6, false] }],

				// Font styling
				["bold", "italic", "underline", "strike"],
				[{ color: [] }, { background: [] }],

				// Paragraph formatting
				[{ align: [] }],
				[{ list: "ordered" }, { list: "bullet" }, { list: "check" }],
				[{ indent: "-1" }, { indent: "+1" }],

				// Media and links
				["link", "image", "video"],
				["blockquote", "code-block"],

				// Utilities
				["clean"],
			],
			[]
		);

		// Formats configuration
		const formats = useMemo(
			() => [
				"font",
				"size",
				"header",
				"bold",
				"italic",
				"underline",
				"strike",
				"color",
				"background",
				"align",
				"list",
				"indent",
				"link",
				"image",
				"video",
				"blockquote",
				"code-block",
			],
			[]
		);

		// Image upload handler
		const handleImageUpload = useCallback(async () => {
			if (!quillRef.current) return;

			const input = document.createElement("input");
			input.setAttribute("type", "file");
			input.setAttribute("accept", allowedFileTypes.join(","));
			input.click();

			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) return;

				// Validate file type
				if (!allowedFileTypes.includes(file.type)) {
					toast.error("Invalid file type. Please select an image file.");
					return;
				}

				// Validate file size
				if (file.size > maxFileSize * 1024 * 1024) {
					toast.error(`File size must be less than ${maxFileSize}MB.`);
					return;
				}

				try {
					setIsUploading(true);

					let imageUrl: string;

					if (onImageUpload) {
						// Use custom upload handler
						imageUrl = await onImageUpload(file);
					} else {
						// Default: convert to base64
						imageUrl = await new Promise((resolve, reject) => {
							const reader = new FileReader();
							reader.onload = (e) => resolve(e.target?.result as string);
							reader.onerror = reject;
							reader.readAsDataURL(file);
						});
					}

					// Insert image into editor
					if (quillRef.current && mountedRef.current) {
						const range = quillRef.current.getSelection(true);
						quillRef.current.insertEmbed(range.index, "image", imageUrl);
						quillRef.current.setSelection(range.index + 1);
					}

					toast.success("Image uploaded successfully!");
				} catch (error) {
					console.error("Image upload failed:", error);
					toast.error("Failed to upload image. Please try again.");
				} finally {
					setIsUploading(false);
				}
			};
		}, [allowedFileTypes, maxFileSize, onImageUpload]);

		// Video upload handler
		const handleVideoUpload = useCallback(async () => {
			if (!quillRef.current) return;

			const input = document.createElement("input");
			input.setAttribute("type", "file");
			input.setAttribute("accept", allowedVideoTypes.join(","));
			input.click();

			input.onchange = async () => {
				const file = input.files?.[0];
				if (!file) return;

				// Validate file type
				if (!allowedVideoTypes.includes(file.type)) {
					toast.error("Invalid file type. Please select a video file.");
					return;
				}

				// Validate file size (videos can be larger, e.g., 50MB)
				const maxVideoSize = maxFileSize * 10; // 10x larger for videos
				if (file.size > maxVideoSize * 1024 * 1024) {
					toast.error(`Video file size must be less than ${maxVideoSize}MB.`);
					return;
				}

				try {
					setIsUploading(true);

					let videoUrl: string;

					if (onVideoUpload) {
						// Use custom upload handler
						videoUrl = await onVideoUpload(file);
					} else {
						// Default: show prompt for video URL (Quill default behavior)
						const url = prompt("Enter video URL:");
						if (!url) {
							setIsUploading(false);
							return;
						}
						videoUrl = url;
					}

					// Insert video into editor
					if (quillRef.current && mountedRef.current) {
						const range = quillRef.current.getSelection(true);
						quillRef.current.insertEmbed(range.index, "video", videoUrl);
						quillRef.current.setSelection(range.index + 1);
					}

					toast.success("Video added successfully!");
				} catch (error) {
					console.error("Video upload failed:", error);
					toast.error("Failed to add video. Please try again.");
				} finally {
					setIsUploading(false);
				}
			};
		}, [allowedVideoTypes, maxFileSize, onVideoUpload]);

		// Cleanup function
		const cleanupQuill = useCallback(() => {
			if (quillRef.current) {
				try {
					quillRef.current.off("text-change");
					quillRef.current.setText("");
					quillRef.current = null;
				} catch {
					quillRef.current = null;
				}
			}

			if (containerRef.current) {
				containerRef.current.innerHTML = "";
			}

			isInitialized.current = false;
		}, []);

		// Initialize Quill
		useEffect(() => {
			if (!mountedRef.current) return;

			// Cleanup first
			cleanupQuill();

			if (!containerRef.current || isInitialized.current) return;

			const timeout = setTimeout(() => {
				if (
					!containerRef.current ||
					!mountedRef.current ||
					isInitialized.current
				) {
					return;
				}

				try {
					const quill = new Quill(containerRef.current, {
						theme: "snow",
						readOnly,
						placeholder,
						modules: {
							toolbar: {
								container: toolbarConfig,
								handlers: {
									image: handleImageUpload,
									video: handleVideoUpload,
								},
							},
							history: {
								delay: 1000,
								maxStack: 500,
								userOnly: true,
							},
						},
						formats,
					});

					quillRef.current = quill;
					isInitialized.current = true;

					// Set initial content
					if (valueRef.current && mountedRef.current) {
						isUpdatingContent.current = true;
						quill.root.innerHTML = valueRef.current;
						isUpdatingContent.current = false;
					}

					// Handle content changes
					quill.on("text-change", () => {
						if (!mountedRef.current || isUpdatingContent.current) return;

						const html = quill.root.innerHTML;
						const text = quill.getText();
						onChangeRef.current?.(html, text);
					});

					// Set minimum height
					if (minHeight && quill.root) {
						quill.root.style.minHeight = minHeight;
					}
				} catch (error) {
					console.error("Failed to initialize Quill:", error);
				}
			}, 100);

			return () => {
				clearTimeout(timeout);
			};
		}, [
			toolbarConfig,
			formats,
			handleImageUpload,
			handleVideoUpload,
			readOnly,
			placeholder,
			minHeight,
			cleanupQuill,
		]); // Stable dependencies only, onChange and value removed to prevent recreation

		// Update content when value changes
		useEffect(() => {
			if (
				quillRef.current &&
				valueRef.current !== undefined &&
				!isUpdatingContent.current &&
				isInitialized.current &&
				mountedRef.current
			) {
				const currentHTML = quillRef.current.root.innerHTML;
				if (currentHTML !== valueRef.current) {
					isUpdatingContent.current = true;
					quillRef.current.root.innerHTML = valueRef.current;
					isUpdatingContent.current = false;
				}
			}
		}); // No dependencies needed since we're using refs

		// Update readonly state
		useEffect(() => {
			if (quillRef.current && isInitialized.current && mountedRef.current) {
				quillRef.current.enable(!readOnly);
			}
		}, [readOnly]);

		// Cleanup on unmount
		useEffect(() => {
			return () => {
				mountedRef.current = false;
				cleanupQuill();
			};
		}, [cleanupQuill]);

		// Imperative handle
		useImperativeHandle(ref, () => ({
			getQuill: () => quillRef.current,
			focus: () => quillRef.current?.focus(),
			blur: () => quillRef.current?.blur(),
			clear: () => quillRef.current?.setText(""),
			getHTML: () => quillRef.current?.root.innerHTML || "",
			getText: () => quillRef.current?.getText() || "",
			setHTML: (html: string) => {
				if (
					quillRef.current &&
					!isUpdatingContent.current &&
					mountedRef.current
				) {
					isUpdatingContent.current = true;
					quillRef.current.root.innerHTML = html;
					isUpdatingContent.current = false;
				}
			},
		}));

		return (
			<div className={cn("enhanced-rich-text-editor", className)}>
				<div ref={containerRef} />
				{isUploading && (
					<div className="bg-background/80 absolute inset-0 flex items-center justify-center rounded-lg backdrop-blur-sm">
						<div className="flex items-center gap-2 rounded-lg bg-white px-4 py-2 shadow-lg">
							<Upload className="h-4 w-4 animate-pulse" />
							<span className="text-sm font-medium">Uploading media...</span>
						</div>
					</div>
				)}
				<style>{`
					.enhanced-rich-text-editor {
						position: relative;
					}
					.enhanced-rich-text-editor .ql-toolbar {
						border-radius: 0.5rem 0.5rem 0 0;
						border: 1px solid hsl(var(--border));
						border-bottom: none;
						background: hsl(var(--background));
						padding: 12px;
					}
					.enhanced-rich-text-editor .ql-container {
						border-radius: 0 0 0.5rem 0.5rem;
						border: 1px solid hsl(var(--border));
						font-family: inherit;
					}
					.enhanced-rich-text-editor .ql-editor {
						min-height: ${minHeight};
						font-size: 14px;
						line-height: 1.6;
						padding: 16px;
						color: hsl(var(--foreground));
					}
					.enhanced-rich-text-editor .ql-editor.ql-blank::before {
						font-style: italic;
						color: hsl(var(--muted-foreground));
					}
					.enhanced-rich-text-editor .ql-toolbar .ql-formats {
						margin-right: 12px;
					}
					.enhanced-rich-text-editor .ql-toolbar .ql-picker-label {
						border: 1px solid hsl(var(--border));
						border-radius: 0.25rem;
						padding: 4px 8px;
						background: hsl(var(--background));
					}
					.enhanced-rich-text-editor .ql-toolbar .ql-picker-label:hover {
						background: hsl(var(--accent));
					}
					.enhanced-rich-text-editor .ql-toolbar button {
						border: 1px solid transparent;
						border-radius: 0.25rem;
						padding: 4px;
						margin: 0 2px;
						transition: all 0.2s;
					}
					.enhanced-rich-text-editor .ql-toolbar button:hover {
						background: hsl(var(--accent));
						border-color: hsl(var(--border));
					}
					.enhanced-rich-text-editor .ql-toolbar button.ql-active {
						background: hsl(var(--primary));
						border-color: hsl(var(--primary));
						color: hsl(var(--primary-foreground));
					}
					.enhanced-rich-text-editor .ql-snow .ql-tooltip {
						background: hsl(var(--popover));
						border: 1px solid hsl(var(--border));
						border-radius: 0.5rem;
						box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
					}
					.enhanced-rich-text-editor .ql-snow .ql-tooltip input {
						background: hsl(var(--background));
						border: 1px solid hsl(var(--border));
						border-radius: 0.25rem;
						color: hsl(var(--foreground));
						padding: 8px;
					}
				`}</style>
			</div>
		);
	}
);

EnhancedRichTextEditor.displayName = "EnhancedRichTextEditor";

/**
 * Default image upload handler using a mock API
 * Replace this with your actual upload logic
 */
export const defaultImageUpload = async (file: File): Promise<string> => {
	// Mock upload - replace with actual API call
	return new Promise((resolve) => {
		const reader = new FileReader();
		reader.onload = (e) => resolve(e.target?.result as string);
		reader.readAsDataURL(file);
	});
};

/**
 * Utility functions for the enhanced editor
 */
export const editorUtils = {
	/**
	 * Extract images from HTML content
	 */
	extractImages: (html: string): string[] => {
		const imgRegex = /<img[^>]+src="([^">]+)"/g;
		const images: string[] = [];
		let match;
		while ((match = imgRegex.exec(html)) !== null) {
			if (match[1]) {
				images.push(match[1]);
			}
		}
		return images;
	},

	/**
	 * Replace image URLs in HTML content
	 */
	replaceImages: (html: string, imageMap: Record<string, string>): string => {
		let result = html;
		for (const [oldUrl, newUrl] of Object.entries(imageMap)) {
			result = result.replace(new RegExp(oldUrl, "g"), newUrl);
		}
		return result;
	},

	/**
	 * Clean up HTML content
	 */
	sanitizeHTML: (html: string): string => {
		// Basic sanitization - use DOMPurify in production
		return html.replace(
			/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
			""
		);
	},

	/**
	 * Get word count from HTML
	 */
	getWordCount: (html: string): number => {
		const text = html.replace(/<[^>]*>/g, "").trim();
		return text ? text.split(/\s+/).length : 0;
	},

	/**
	 * Get character count from HTML
	 */
	getCharacterCount: (html: string): number => {
		return html.replace(/<[^>]*>/g, "").length;
	},
};
