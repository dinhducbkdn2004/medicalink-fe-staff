import { cn } from "@/lib";
import { motion } from "framer-motion";

interface EnhancedSkeletonProps {
	className?: string;
	variant?: "default" | "card" | "table" | "stats";
	lines?: number;
	shimmer?: boolean;
}

const shimmerVariants = {
	initial: { x: "-100%" },
	animate: {
		x: "100%",
		transition: {
			duration: 1.5,
			ease: "easeInOut" as const,
			repeat: Infinity,
			repeatDelay: 0.5,
		},
	},
};

export const EnhancedSkeleton = ({
	className,
	variant = "default",
	lines = 1,
	shimmer = true,
	...props
}: EnhancedSkeletonProps & React.HTMLAttributes<HTMLDivElement>) => {
	const baseClass =
		"animate-pulse rounded-md bg-muted relative overflow-hidden";

	if (variant === "card") {
		return (
			<div className={cn("space-y-3 p-4", className)}>
				<div className={cn(baseClass, "relative h-4 w-3/4 overflow-hidden")}>
					{shimmer && (
						<motion.div
							variants={shimmerVariants}
							initial="initial"
							animate="animate"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					)}
				</div>
				<div className={cn(baseClass, "h-8 w-1/2")}>
					{shimmer && (
						<motion.div
							variants={shimmerVariants}
							initial="initial"
							animate="animate"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					)}
				</div>
				<div className={cn(baseClass, "h-3 w-2/3")}>
					{shimmer && (
						<motion.div
							variants={shimmerVariants}
							initial="initial"
							animate="animate"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					)}
				</div>
			</div>
		);
	}

	if (variant === "stats") {
		return (
			<div className={cn("space-y-2 p-4", className)}>
				<div className={cn(baseClass, "h-3 w-1/4")}>
					{shimmer && (
						<motion.div
							variants={shimmerVariants}
							initial="initial"
							animate="animate"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					)}
				</div>
				<div className={cn(baseClass, "h-8 w-1/2")}>
					{shimmer && (
						<motion.div
							variants={shimmerVariants}
							initial="initial"
							animate="animate"
							className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
						/>
					)}
				</div>
			</div>
		);
	}

	if (variant === "table") {
		return (
			<div className={cn("space-y-2", className)}>
				{Array.from({ length: lines }, (_, i) => (
					<div key={i} className={cn(baseClass, "h-12 w-full")}>
						{shimmer && (
							<motion.div
								variants={shimmerVariants}
								initial="initial"
								animate="animate"
								className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
							/>
						)}
					</div>
				))}
			</div>
		);
	}

	return (
		<div className={cn(baseClass, className)} {...props}>
			{shimmer && (
				<motion.div
					variants={shimmerVariants}
					initial="initial"
					animate="animate"
					className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
				/>
			)}
		</div>
	);
};
