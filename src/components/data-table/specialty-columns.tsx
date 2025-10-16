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
import { MoreHorizontal, Eye, Edit, Trash2, Stethoscope } from "lucide-react";

export interface SpecialtyData {
	id: string;
	name: string;
	description: string | null;
	isActive: boolean;
	infoSectionsCount?: number;
	createdAt: string;
	updatedAt: string;
}

interface CreateSpecialtyColumnsProps {
	onView: (specialtyId: string) => void;
	onEdit: (specialtyId: string) => void;
	onDelete: (specialtyId: string) => void;
}

export function createSpecialtyColumns({
	onView,
	onEdit,
	onDelete,
}: CreateSpecialtyColumnsProps): ColumnDef<SpecialtyData>[] {
	return [
		{
			accessorKey: "name",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Specialty Name" />
			),
			cell: ({ row }) => {
				const specialty = row.original;
				return (
					<div className="flex max-w-[300px] min-w-[200px] items-center gap-3">
						<div className="bg-primary/10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
							<Stethoscope className="text-primary h-4 w-4" />
						</div>
						<div className="flex min-w-0 flex-col">
							<span className="truncate font-medium">{specialty.name}</span>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "description",
			header: "Description",
			cell: ({ row }) => {
				const description = row.getValue("description") as string | null;
				return (
					<div className="max-w-md">
						<p className="text-muted-foreground line-clamp-2 text-sm">
							{description || "No description"}
						</p>
					</div>
				);
			},
		},
		{
			accessorKey: "infoSectionsCount",
			header: "Info Sections",
			cell: ({ row }) => {
				const count = row.getValue("infoSectionsCount") as number | undefined;
				return (
					<div className="text-sm">
						{count || 0} {count === 1 ? "section" : "sections"}
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
				const specialty = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onView(specialty.id)}>
								<Eye className="mr-2 h-4 w-4" />
								View Details
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => onEdit(specialty.id)}>
								<Edit className="mr-2 h-4 w-4" />
								Edit
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete(specialty.id)}
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
