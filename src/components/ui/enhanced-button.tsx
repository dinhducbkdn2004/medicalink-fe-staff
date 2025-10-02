import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:scale-105 active:scale-95",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/90 hover:shadow-md",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90 hover:shadow-md",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground hover:shadow-sm",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80 hover:shadow-sm",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	}
);

export interface EnhancedButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
	loadingText?: string;
	icon?: React.ReactNode;
	rightIcon?: React.ReactNode;
	animate?: boolean;
}

const EnhancedButton = React.forwardRef<HTMLButtonElement, EnhancedButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			loadingText,
			icon,
			rightIcon,
			animate = true,
			children,
			disabled,
			...props
		},
		ref
	) => {
		if (asChild) {
			return (
				<Slot
					className={cn(buttonVariants({ variant, size, className }))}
					ref={ref}
					{...props}
				>
					{children}
				</Slot>
			);
		}

		return (
			<button
				className={cn(
					buttonVariants({ variant, size, className }),
					loading && "animate-pulse",
					!animate && "transform-none hover:scale-100 active:scale-100"
				)}
				ref={ref}
				disabled={disabled || loading}
				{...props}
			>
				{loading && (
					<div className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
				)}
				{!loading && icon && <span className="mr-2">{icon}</span>}
				{loading ? loadingText || "Loading..." : children}
				{!loading && rightIcon && <span className="ml-2">{rightIcon}</span>}
			</button>
		);
	}
);
EnhancedButton.displayName = "EnhancedButton";

export { EnhancedButton, buttonVariants };
