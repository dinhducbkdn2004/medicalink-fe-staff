/**
 * Rich Text Editor Component using QuillJS
 * Supports HTML content with special tags like <b>, <i>, <p>, etc.
 * Fixed toolbar duplication and focus issues
 */

import {
	useEffect,
	useRef,
	forwardRef,
	useImperativeHandle,
	useCallback,
} from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	value?: string;
	onChange?: (html: string, text: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	theme?: "snow" | "bubble";
	className?: string;
	modules?: any;
	formats?: string[];
	minHeight?: string;
}

export interface RichTextEditorRef {
	getQuill: () => Quill | null;
	focus: () => void;
	blur: () => void;
	clear: () => void;
	getHTML: () => string;
	getText: () => string;
	setHTML: (html: string) => void;
}

export const RichTextEditor = forwardRef<
	RichTextEditorRef,
	RichTextEditorProps
>(
	(
		{
			value = "",
			onChange,
			placeholder = "Write something...",
			readOnly = false,
			theme = "snow",
			className,
			modules,
			formats,
			minHeight = "200px",
		},
		ref
	) => {
		const containerRef = useRef<HTMLDivElement>(null);
		const quillRef = useRef<Quill | null>(null);
		const isUpdatingContent = useRef(false);
		const isInitialized = useRef(false);

		// Default modules configuration
		const defaultModules = {
			toolbar: [
				[{ header: [1, 2, 3, false] }],
				["bold", "italic", "underline", "strike"],
				[{ list: "ordered" }, { list: "bullet" }],
				["blockquote", "code-block"],
				["link"],
				["clean"],
			],
			history: {
				delay: 1000,
				maxStack: 500,
				userOnly: true,
			},
		};

		// Default formats
		const defaultFormats = [
			"header",
			"bold",
			"italic",
			"underline",
			"strike",
			"list",
			"bullet",
			"blockquote",
			"code-block",
			"link",
		];

		// Cleanup function to properly destroy Quill instance
		const cleanupQuill = useCallback(() => {
			if (quillRef.current) {
				try {
					// Remove all event listeners
					quillRef.current.off("text-change");
					// Clear the editor content
					quillRef.current.setText("");
					// Set to null
					quillRef.current = null;
				} catch (_error) {
					// Ignore cleanup errors
					quillRef.current = null;
				}
			}

			// Clear the DOM completely
			if (containerRef.current) {
				containerRef.current.innerHTML = "";
			}

			isInitialized.current = false;
		}, []);

		useImperativeHandle(ref, () => ({
			getQuill: () => quillRef.current,
			focus: () => quillRef.current?.focus(),
			blur: () => quillRef.current?.blur(),
			clear: () => quillRef.current?.setText(""),
			getHTML: () => quillRef.current?.root.innerHTML || "",
			getText: () => quillRef.current?.getText() || "",
			setHTML: (html: string) => {
				if (quillRef.current && !isUpdatingContent.current) {
					isUpdatingContent.current = true;
					quillRef.current.root.innerHTML = html;
					isUpdatingContent.current = false;
				}
			},
		}));

		useEffect(() => {
			// Always cleanup first to prevent multiple instances
			cleanupQuill();

			if (!containerRef.current || isInitialized.current) return;

			// Small delay to ensure DOM is ready
			const timeout = setTimeout(() => {
				if (containerRef.current && !isInitialized.current) {
					// Initialize Quill
					const quill = new Quill(containerRef.current, {
						theme,
						modules: modules || defaultModules,
						formats: formats || defaultFormats,
						placeholder,
						readOnly,
					});

					quillRef.current = quill;
					isInitialized.current = true;

					// Set initial content
					if (value) {
						isUpdatingContent.current = true;
						quill.root.innerHTML = value;
						isUpdatingContent.current = false;
					}

					// Handle content changes
					const handleTextChange = () => {
						if (isUpdatingContent.current) return;

						const html = quill.root.innerHTML;
						const text = quill.getText();
						onChange?.(html, text);
					};

					quill.on("text-change", handleTextChange);

					// Set minimum height
					if (minHeight) {
						quill.root.style.minHeight = minHeight;
					}
				}
			}, 100);

			// Cleanup
			return () => {
				clearTimeout(timeout);
				cleanupQuill();
			};
		}, [
			theme,
			readOnly,
			placeholder,
			modules,
			formats,
			minHeight,
			cleanupQuill,
		]);

		// Update content when value prop changes
		useEffect(() => {
			if (
				quillRef.current &&
				value !== undefined &&
				!isUpdatingContent.current &&
				isInitialized.current
			) {
				const currentHTML = quillRef.current.root.innerHTML;
				if (currentHTML !== value) {
					isUpdatingContent.current = true;
					quillRef.current.root.innerHTML = value;
					isUpdatingContent.current = false;
				}
			}
		}, [value]);

		// Update readOnly state
		useEffect(() => {
			if (quillRef.current && isInitialized.current) {
				quillRef.current.enable(!readOnly);
			}
		}, [readOnly]);

		// Cleanup on component unmount
		useEffect(() => {
			return () => {
				cleanupQuill();
			};
		}, [cleanupQuill]);

		return (
			<div className={cn("rich-text-editor", className)}>
				<div ref={containerRef} />
				<style>{`
					.rich-text-editor .ql-editor {
						min-height: ${minHeight};
						font-size: 14px;
						line-height: 1.6;
					}
					.rich-text-editor .ql-editor.ql-blank::before {
						font-style: italic;
						color: #9ca3af;
					}
					.rich-text-editor .ql-toolbar {
						border-radius: 0.5rem 0.5rem 0 0;
						border-bottom: 1px solid #e5e7eb;
					}
					.rich-text-editor .ql-container {
						border-radius: 0 0 0.5rem 0.5rem;
					}
				`}</style>
			</div>
		);
	}
);

RichTextEditor.displayName = "RichTextEditor";

/**
 * Utility functions for HTML content processing
 */
export const htmlUtils = {
	/**
	 * Sanitize HTML content to only allow safe tags
	 */
	sanitize: (html: string): string => {
		// Basic sanitization - in production, consider using a library like DOMPurify
		return html.replace(
			/<(?!\/?(p|br|b|i|u|strong|em|ul|ol|li|h[1-6]|blockquote|a)\b)[^>]*>/gi,
			""
		);
	},

	/**
	 * Convert HTML to plain text
	 */
	toPlainText: (html: string): string => {
		return html.replace(/<[^>]*>/g, "").trim();
	},

	/**
	 * Extract text content without HTML tags
	 */
	extractText: (html: string): string => {
		const div = document.createElement("div");
		div.innerHTML = html;
		return div.textContent || div.innerText || "";
	},

	/**
	 * Check if HTML content is empty (only contains empty tags)
	 */
	isEmpty: (html: string): boolean => {
		const text = htmlUtils.extractText(html);
		return !text.trim();
	},
};
