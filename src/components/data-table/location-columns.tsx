import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DataTableColumnHeader } from "./data-table-column-header";
import {
	MoreHorizontal,
	Eye,
	Edit,
	Trash2,
	Building2
} from "lucide-react";

export interface WorkLocationData {
	id: string;
	name: string;
	address: string | null;
	city: string | null;
	phone: string | null;
	timezone: string;
	isActive: boolean;
	createdAt: string;
	updatedAt: string;
}

interface CreateLocationColumnsProps {
	onView: (locationId: string) => void;
	onEdit: (locationId: string) => void;
	onDelete: (locationId: string) => void;
}

export function createLocationColumns({
	onView,
	onEdit,
	onDelete,
}: CreateLocationColumnsProps): ColumnDef<WorkLocationData>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Location" />
			),
			cell: ({ row }) => {
				const location = row.original;
				return (
					<div className="flex max-w-[300px] min-w-[200px] items-center gap-3">
						<div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
							<Building2 className="text-primary h-4 w-4" />
						</div>
						<div className="flex min-w-0 flex-col">
							<span className="truncate font-medium">{location.name}</span>
							{location.city && (
								<span className="text-muted-foreground truncate text-xs">
									{location.city}
								</span>
							)}
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "address",
			header: "Address",
			cell: ({ row }) => {
				const address = row.getValue("address") as string | null;
				return (
					<div className="flex max-w-xs items-start gap-2">
						<p className="text-muted-foreground line-clamp-2 text-sm">
							{address || "No address"}
						</p>
					</div>
				);
			},
		},
		{
			accessorKey: "phone",
			header: "Phone",
			cell: ({ row }) => {
				const phone = row.getValue("phone") as string | null;
				return phone ? (
					<div className="flex items-center gap-2 text-sm whitespace-nowrap">
						{phone}
					</div>
				) : (
					<span className="text-muted-foreground text-sm">-</span>
				);
			},
		},
		{
			accessorKey: "timezone",
			header: "Timezone",
			cell: ({ row }) => {
				const timezone = row.getValue("timezone") as string;
				return (
					<div className="flex items-center gap-2 text-sm whitespace-nowrap">
						{timezone}
					</div>
				);
			},
		},
		{
			accessorKey: "isActive",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Status" />
			),
			cell: ({ row }) => {
				const isActive = row.getValue("isActive") as boolean;
				return (
					<Badge
						variant={isActive ? "default" : "secondary"}
						className={
							isActive
								? "border-green-200 bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100"
								: "border-gray-200 bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300"
						}
					>
						{isActive ? "Active" : "Inactive"}
					</Badge>
				);
			},
			filterFn: (row, id, value) => {
				return value.includes(row.getValue(id));
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created" />
			),
			cell: ({ row }) => {
				const date = new Date(row.getValue("createdAt"));
				return (
					<div className="text-muted-foreground text-sm whitespace-nowrap">
						{date.toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</div>
				);
			},
		},
		{
			id: "actions",
			cell: ({ row }) => {
				const location = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onView(location.id)}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(location.id)}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete(location.id)}
								className="text-red-600 focus:text-red-600"
							>
								<Trash2 className="mr-2 h-4 w-4" />
								Delete
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				);
			},
		},
	];
}
