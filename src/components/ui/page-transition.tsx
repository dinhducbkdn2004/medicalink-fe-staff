import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
	children: ReactNode;
	className?: string;
}

const pageVariants = {
	initial: {
		opacity: 0,
		y: 20,
		scale: 0.98,
	},
	in: {
		opacity: 1,
		y: 0,
		scale: 1,
	},
	out: {
		opacity: 0,
		y: -20,
		scale: 0.98,
	},
};

const pageTransition = {
	type: "tween" as const,
	ease: "anticipate" as const,
	duration: 0.4,
};

export const PageTransition = ({
	children,
	className,
}: PageTransitionProps) => {
	return (
		<AnimatePresence mode="wait" initial={false}>
			<motion.div
				initial="initial"
				animate="in"
				exit="out"
				variants={pageVariants}
				transition={pageTransition}
				className={className}
			>
				{children}
			</motion.div>
		</AnimatePresence>
	);
};
