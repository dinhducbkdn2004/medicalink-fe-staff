import * as React from "react";
import {
	ContextMenu,
	ContextMenuContent,
	ContextMenuItem,
	ContextMenuSeparator,
	ContextMenuTrigger,
} from "@/components/ui/context-menu";

export interface ContextMenuAction {
	label: string;
	icon?: React.ReactNode;
	onClick: () => void;
	className?: string;
	separator?: boolean;
}

interface DataTableContextMenuProps {
	children: React.ReactNode;
	actions: ContextMenuAction[];
}

export function DataTableContextMenu({
	children,
	actions,
}: DataTableContextMenuProps) {
	return (
		<ContextMenu>
			<ContextMenuTrigger asChild>{children}</ContextMenuTrigger>
			<ContextMenuContent className="w-48">
				{actions.map((action, index) => (
					<React.Fragment key={`${action.label}-${index}`}>
						{action.separator && index > 0 && <ContextMenuSeparator />}
						<ContextMenuItem
							onClick={action.onClick}
							className={action.className}
						>
							{action.icon && <span className="mr-2">{action.icon}</span>}
							{action.label}
						</ContextMenuItem>
					</React.Fragment>
				))}
			</ContextMenuContent>
		</ContextMenu>
	);
}
