import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Trash2, Lock } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { DataTableColumnHeader } from "./data-table-column-header";

export type DoctorAccount = {
	id: string;
	fullName: string;
	email: string;
	phone: string | null;
	dateOfBirth: string | null;
	isMale: boolean;
	createdAt: string;
	updatedAt: string;
};

interface DoctorColumnsProps {
	onView: (id: string) => void;
	onEdit: (id: string) => void;
	onChangePassword: (id: string) => void;
	onDelete: (id: string) => void;
}

export function createDoctorColumns({
	onView,
	onEdit,
	onChangePassword,
	onDelete,
}: DoctorColumnsProps): ColumnDef<DoctorAccount>[] {
	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return [
		{
			accessorKey: "fullName",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Doctor" />
			),
			cell: ({ row }) => {
				const doctor = row.original;
				return (
					<div className="flex items-center gap-3">
						<Avatar className="h-10 w-10">
							<AvatarFallback className="bg-primary text-primary-foreground text-sm font-semibold">
								{getInitials(doctor.fullName)}
							</AvatarFallback>
						</Avatar>
						<div>
							<div className="font-medium">{doctor.fullName}</div>
						</div>
					</div>
				);
			},
		},
		{
			accessorKey: "email",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Email" />
			),
			cell: ({ row }) => {
				return <div className="text-sm">{row.getValue("email")}</div>;
			},
		},
		{
			accessorKey: "phone",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Phone" />
			),
			cell: ({ row }) => {
				const phone = row.getValue("phone");
				return (
					<div className="text-sm">
						{(phone as string) ?? (
							<span className="text-muted-foreground italic">N/A</span>
						)}
					</div>
				);
			},
		},
		{
			accessorKey: "dateOfBirth",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Date of Birth" />
			),
			cell: ({ row }) => {
				const dateOfBirth = row.getValue("dateOfBirth");
				if (!dateOfBirth) {
					return (
						<span className="text-muted-foreground block italic">N/A</span>
					);
				}
				return (
					<div className="text-sm">
						{new Date(dateOfBirth as string).toLocaleDateString("en-US", {
							year: "numeric",
							month: "short",
							day: "numeric",
						})}
					</div>
				);
			},
		},
		{
			accessorKey: "isMale",
			header: "Gender",
			cell: ({ row }) => {
				const isMale = row.getValue("isMale");
				return <div className="text-sm">{isMale ? "Male" : "Female"}</div>;
			},
		},
		{
			accessorKey: "createdAt",
			header: ({ column }) => (
				<DataTableColumnHeader column={column} title="Created At" />
			),
			cell: ({ row }) => {
				const createdAt = row.getValue("createdAt") ?? null;
				if (!createdAt) {
					return (
						<span className="text-muted-foreground block italic">N/A</span>
					);
				}
				return (
					<div className="text-sm">
						{new Date(createdAt as string).toLocaleDateString("en-US", {
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
			header: "Actions",
			cell: ({ row }) => {
				const doctor = row.original;

				return (
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="ghost" className="h-8 w-8 p-0">
								<span className="sr-only">Open menu</span>
								<MoreHorizontal className="h-4 w-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end">
							<DropdownMenuItem onClick={() => onView(doctor.id)}>
								<Eye className="mr-2 h-4 w-4" />
								View Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onEdit(doctor.id)}>
								<Pencil className="mr-2 h-4 w-4" />
								Edit Profile
							</DropdownMenuItem>
							<DropdownMenuItem onClick={() => onChangePassword(doctor.id)}>
								<Lock className="mr-2 h-4 w-4" />
								Change Password
							</DropdownMenuItem>
							<DropdownMenuSeparator />
							<DropdownMenuItem
								onClick={() => onDelete(doctor.id)}
								className="text-red-600"
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
