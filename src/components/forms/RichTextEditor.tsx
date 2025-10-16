import { useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface RichTextEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	className?: string;
	disabled?: boolean;
	minHeight?: number;
}

export function RichTextEditor({
	value,
	onChange,
	placeholder = "Enter content...",
	className,
	disabled = false,
	minHeight = 200,
}: RichTextEditorProps) {
	const editorRef = useRef<HTMLDivElement>(null);
	const quillRef = useRef<any>(null);

	useEffect(() => {
		// Dynamically import Quill to avoid SSR issues
		const initializeQuill = async () => {
			if (typeof window === "undefined") return;

			try {
				const QuillModule = await import("quill");
				const Quill = QuillModule.default;

				// Import Quill CSS
				await import("quill/dist/quill.snow.css");

				if (editorRef.current && !quillRef.current) {
					quillRef.current = new Quill(editorRef.current, {
						theme: "snow",
						placeholder,
						readOnly: disabled,
						modules: {
							toolbar: [
								[{ header: [1, 2, 3, false] }],
								["bold", "italic", "underline", "strike"],
								[{ list: "ordered" }, { list: "bullet" }],
								[{ align: [] }],
								["link"],
								[{ color: [] }, { background: [] }],
								["clean"],
							],
						},
						formats: [
							"header",
							"bold",
							"italic",
							"underline",
							"strike",
							"list",
							"bullet",
							"align",
							"link",
							"color",
							"background",
						],
					});

					// Set initial content
					if (value) {
						quillRef.current.root.innerHTML = value;
					}

					// Listen for text changes
					quillRef.current.on("text-change", () => {
						const html = quillRef.current.root.innerHTML;
						onChange(html);
					});
				}
			} catch (error) {
				console.error("Failed to initialize Quill:", error);
			}
		};

		initializeQuill();

		return () => {
			if (quillRef.current) {
				quillRef.current = null;
			}
		};
	}, [disabled, onChange, placeholder, value]);

	// Update content when value prop changes
	useEffect(() => {
		if (quillRef.current && value !== quillRef.current.root.innerHTML) {
			quillRef.current.root.innerHTML = value;
		}
	}, [value]);

	// Update disabled state
	useEffect(() => {
		if (quillRef.current) {
			quillRef.current.enable(!disabled);
		}
	}, [disabled]);

	return (
		<div
			className={cn(
				"border-input bg-background rounded-md border",
				disabled && "cursor-not-allowed opacity-50",
				className
			)}
		>
			<div
				ref={editorRef}
				style={{ minHeight: `${minHeight}px` }}
				className="prose prose-sm max-w-none"
			/>
		</div>
	);
}
