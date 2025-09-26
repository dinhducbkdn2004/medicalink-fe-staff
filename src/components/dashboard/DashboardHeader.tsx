import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { ModeToggle } from "@/components/mode-toggle";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RefreshCw, Settings, Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface DashboardHeaderProps {
	title?: string;
	showSearch?: boolean;
	onRefresh?: () => void;
}

export const DashboardHeader = ({
	title = "Dashboard",
	showSearch = false,
	onRefresh,
}: DashboardHeaderProps) => {
	return (
		<header className="bg-background/95 supports-[backdrop-filter]:bg-background/60 flex h-16 shrink-0 items-center gap-2 border-b backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
			<div className="flex items-center gap-2 px-4">
				<SidebarTrigger className="-ml-1" />
				<Separator
					orientation="vertical"
					className="mr-2 data-[orientation=vertical]:h-4"
				/>
				<Breadcrumb>
					<BreadcrumbList>
						<BreadcrumbItem className="hidden md:block">
							<BreadcrumbLink href="/super-admin">Super Admin</BreadcrumbLink>
						</BreadcrumbItem>
						<BreadcrumbSeparator className="hidden md:block" />
						<BreadcrumbItem>
							<BreadcrumbPage>{title}</BreadcrumbPage>
						</BreadcrumbItem>
					</BreadcrumbList>
				</Breadcrumb>
			</div>

			{showSearch && (
				<div className="mx-4 max-w-sm flex-1">
					<div className="relative">
						<Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
						<Input placeholder="Search..." className="pl-8" />
					</div>
				</div>
			)}

			<div className="ml-auto flex items-center gap-2 px-4">
				{onRefresh && (
					<Button variant="outline" size="sm" onClick={onRefresh}>
						<RefreshCw className="mr-2 h-4 w-4" />
						Refresh
					</Button>
				)}

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm" className="relative">
							<Bell className="h-4 w-4" />
							<Badge
								variant="destructive"
								className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full p-0 text-xs"
							>
								3
							</Badge>
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end" className="w-80">
						<DropdownMenuLabel>Notifications</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">New Admin Registration</p>
								<p className="text-muted-foreground text-xs">
									Nguyen Van A has created an admin account
								</p>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">Weekly Report</p>
								<p className="text-muted-foreground text-xs">
									System activity report is ready
								</p>
							</div>
						</DropdownMenuItem>
						<DropdownMenuItem>
							<div className="flex flex-col space-y-1">
								<p className="text-sm font-medium">Security Alert</p>
								<p className="text-muted-foreground text-xs">
									2 failed login attempts detected
								</p>
							</div>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="outline" size="sm">
							<Settings className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuLabel>Settings</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuItem>Notifications</DropdownMenuItem>
						<DropdownMenuItem>Security</DropdownMenuItem>
						<DropdownMenuItem>System</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>

				<ModeToggle />
			</div>
		</header>
	);
};
