import { useEffect, useRef, useCallback, useState } from "react";
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
	const isUpdatingRef = useRef(false);
	const mountedRef = useRef(true);
	const [isInitialized, setIsInitialized] = useState(false);

	// Cleanup function
	const cleanup = useCallback(() => {
		if (quillRef.current) {
			try {
				quillRef.current.off("text-change");
				quillRef.current = null;
			} catch {
				quillRef.current = null;
			}
		}
		if (editorRef.current) {
			editorRef.current.innerHTML = "";
		}
		setIsInitialized(false);
	}, []);

	useEffect(() => {
		// Initialize Quill only once
		const initializeQuill = async () => {
			if (!mountedRef.current || isInitialized || !editorRef.current) {
				return;
			}

			try {
				const QuillModule = await import("quill");
				const Quill = QuillModule.default;

				// Import Quill CSS
				await import("quill/dist/quill.snow.css");

				if (!mountedRef.current || isInitialized) return;

				const quill = new Quill(editorRef.current, {
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
						"align",
						"link",
						"color",
						"background",
					],
				});

				quillRef.current = quill;
				setIsInitialized(true);

				// Set initial content
				if (value && mountedRef.current) {
					isUpdatingRef.current = true;
					quill.root.innerHTML = value;
					isUpdatingRef.current = false;
				}

				// Listen for text changes
				quill.on("text-change", () => {
					if (!mountedRef.current || isUpdatingRef.current) return;
					const html = quill.root.innerHTML;
					onChange(html);
				});
			} catch (error) {
				console.error("Failed to initialize Quill:", error);
			}
		};

		initializeQuill();

		return () => {
			mountedRef.current = false;
			cleanup();
		};
	}, [cleanup, disabled, isInitialized, onChange, placeholder, value]); // Add missing dependencies

	// Update content when value prop changes
	useEffect(() => {
		if (
			quillRef.current &&
			isInitialized &&
			mountedRef.current &&
			!isUpdatingRef.current &&
			value !== quillRef.current.root.innerHTML
		) {
			isUpdatingRef.current = true;
			quillRef.current.root.innerHTML = value;
			isUpdatingRef.current = false;
		}
	}, [value, isInitialized]);

	// Update disabled state
	useEffect(() => {
		if (quillRef.current && isInitialized && mountedRef.current) {
			quillRef.current.enable(!disabled);
		}
	}, [disabled, isInitialized]);

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
