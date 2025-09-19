"use client";

import { useDroppable } from "@dnd-kit/core";

import { cn } from "@/lib/utils";
import { useCalendarDnd } from "@/components/event-calendar";

interface DroppableCellProps {
	readonly id: string;
	readonly date: Date;
	readonly time?: number;
	readonly children?: React.ReactNode;
	readonly className?: string;
	readonly onClick?: () => void;
}

export function DroppableCell({
	id,
	date,
	time,
	children,
	className,
	onClick,
}: DroppableCellProps) {
	const { activeEvent } = useCalendarDnd();

	const { setNodeRef, isOver } = useDroppable({
		id,
		data: {
			date,
			time,
		},
	});

	// Format time for display in tooltip (only for debugging)
	const formattedTime =
		time !== undefined
			? `${Math.floor(time)}:${Math.round((time - Math.floor(time)) * 60)
					.toString()
					.padStart(2, "0")}`
			: null;

	return (
		<div
			ref={setNodeRef}
			onClick={onClick}
			onKeyDown={(e) => {
				if (e.key === "Enter" || e.key === " ") {
					e.preventDefault();
					onClick?.();
				}
			}}
			role="button"
			tabIndex={0}
			className={cn(
				"data-dragging:bg-accent flex h-full flex-col px-0.5 py-1 sm:px-1",
				className
			)}
			title={formattedTime ? `${formattedTime}` : undefined}
			data-dragging={isOver && activeEvent ? true : undefined}
		>
			{children}
		</div>
	);
}
