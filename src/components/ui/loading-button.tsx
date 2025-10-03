import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import * as React from "react";

interface LoadingButtonProps extends React.ComponentProps<typeof Button> {
	loading?: boolean;
	loadingText?: string;
}

export function LoadingButton({
	children,
	loading = false,
	loadingText,
	disabled,
	className,
	...props
}: LoadingButtonProps) {
	return (
		<Button {...props} disabled={loading || disabled} className={cn(className)}>
			{loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
			{loading ? loadingText || children : children}
		</Button>
	);
}
