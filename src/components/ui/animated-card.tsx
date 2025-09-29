import { HTMLMotionProps, motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface AnimatedCardProps extends HTMLMotionProps<"div"> {
	children: React.ReactNode;
	delay?: number;
	hover?: boolean;
	className?: string;
}

const cardVariants = {
	hidden: {
		opacity: 0,
		y: 20,
		scale: 0.95,
	},
	visible: (delay: number) => ({
		opacity: 1,
		y: 0,
		scale: 1,
		transition: {
			duration: 0.5,
			delay: delay * 0.1,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	}),
	hover: {
		y: -4,
		scale: 1.02,
		transition: {
			duration: 0.2,
			ease: "easeOut" as const,
		},
	},
};

export const AnimatedCard = ({
	children,
	delay = 0,
	hover = true,
	className,
	...props
}: AnimatedCardProps) => {
	return (
		<motion.div
			custom={delay}
			initial="hidden"
			animate="visible"
			whileHover={hover ? "hover" : {}}
			variants={cardVariants}
			className={cn(
				"transition-shadow duration-200",
				hover && "hover:shadow-primary/10 hover:shadow-lg",
				className
			)}
			{...props}
		>
			{children}
		</motion.div>
	);
};

// Staggered container for multiple cards
const containerVariants = {
	hidden: { opacity: 0 },
	visible: {
		opacity: 1,
		transition: {
			staggerChildren: 0.1,
			delayChildren: 0.2,
		},
	},
};

const itemVariants = {
	hidden: { opacity: 0, y: 20 },
	visible: {
		opacity: 1,
		y: 0,
		transition: {
			duration: 0.5,
			ease: [0.25, 0.46, 0.45, 0.94] as const,
		},
	},
};

interface StaggeredContainerProps {
	children: React.ReactNode;
	className?: string;
}

export const StaggeredContainer = ({
	children,
	className,
}: StaggeredContainerProps) => {
	return (
		<motion.div
			variants={containerVariants}
			initial="hidden"
			animate="visible"
			className={className}
		>
			{children}
		</motion.div>
	);
};

export const StaggeredItem = ({
	children,
	className,
}: {
	children: React.ReactNode;
	className?: string;
}) => {
	return (
		<motion.div variants={itemVariants} className={className}>
			{children}
		</motion.div>
	);
};
