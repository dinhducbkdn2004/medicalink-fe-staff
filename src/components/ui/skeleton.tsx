import { cn } from "@/lib/utilities";

function Skeleton({
	className,
	...props
}: React.HTMLAttributes<HTMLDivElement>): React.JSX.Element {
	return (
		<div
			className={cn("animate-pulse rounded-md bg-muted", className)}
			{...props}
		/>
	);
}

export { Skeleton };
