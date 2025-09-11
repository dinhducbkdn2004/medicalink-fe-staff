import { ChevronsUpDown, User, Users, Sparkles, LogOut } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";

export function NavUser({
	user,
}: {
	user: {
		name: string;
		email: string;
		avatar: string;
	};
}) {
	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							size="lg"
							className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground [&>svg]:size-5"
						>
							<Avatar className="size-8">
								<AvatarImage src={user.avatar} alt={user.name} />
								<AvatarFallback className="rounded-lg">S</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-medium">{user.name}</span>
							</div>
							<ChevronsUpDown className="text-muted-foreground/80 ml-auto size-5" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="dark bg-sidebar w-(--radix-dropdown-menu-trigger-width)"
						side="bottom"
						align="end"
						sideOffset={4}
					>
						<DropdownMenuGroup>
							<DropdownMenuItem className="focus:bg-sidebar-accent gap-3">
								<User className="text-muted-foreground/80 size-5" />
								Profile
							</DropdownMenuItem>
							<DropdownMenuItem className="focus:bg-sidebar-accent gap-3">
								<Users className="text-muted-foreground/80 size-5" />
								Accounts
							</DropdownMenuItem>
							<DropdownMenuItem className="focus:bg-sidebar-accent gap-3">
								<Sparkles className="text-muted-foreground/80 size-5" />
								Upgrade
							</DropdownMenuItem>
							<DropdownMenuItem className="focus:bg-sidebar-accent gap-3">
								<LogOut className="text-muted-foreground/80 size-5" />
								Logout
							</DropdownMenuItem>
						</DropdownMenuGroup>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
