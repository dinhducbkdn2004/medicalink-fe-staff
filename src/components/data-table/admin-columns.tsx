"use client";

import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, Eye, Pencil, Lock, Trash2 } from "lucide-react";

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

export type AdminAccount = {
	id: string;
	fullName: string;
	email: string;
	phone: string | null;
	dateOfBirth: string | null;
	role: "ADMIN" | "SUPER_ADMIN";
	isMale: boolean;
	createdAt: string;
	updatedAt: string;
};

interface AdminColumnsProps {
	onView: (adminId: string) => void;
	onEdit: (adminId: string) => void;
	onChangePassword: (adminId: string) => void;
	onDelete: (adminId: string) => void;
}

export const createAdminColumns = (
	actions: AdminColumnsProps
): ColumnDef<AdminAccount>[] => [
	{
		accessorKey: "fullName",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Admin" />
		),
		cell: ({ row }) => {
			const admin = row.original;
			const getInitials = (name: string) => {
				return name
					.split(" ")
					.map((n) => n[0])
					.join("")
					.toUpperCase()
					.slice(0, 2);
			};

			return (
				<div className="flex items-center space-x-3">
					<Avatar className="h-10 w-10">
						<AvatarFallback>{getInitials(admin.fullName)}</AvatarFallback>
					</Avatar>
					<div>
						<div className="font-medium">{admin.fullName}</div>
						<div className="text-muted-foreground text-sm">
							{admin.role === "SUPER_ADMIN" ? "Super Admin" : "Admin"}
						</div>
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
			return <div className="text-sm font-medium">{row.getValue("email")}</div>;
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
						<span className="text-muted-foreground">N/A</span>
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
					<span className="text-muted-foreground italic">Not provided</span>
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
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Gender" />
		),
		cell: ({ row }) => {
			return (
				<span className="text-sm font-medium">
					{row.getValue("isMale") ? "Male" : "Female"}
				</span>
			);
		},
	},
	{
		accessorKey: "createdAt",
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Created At" />
		),
		cell: ({ row }) => {
			const createdAt = row.getValue("createdAt");
			if (!createdAt) {
				return (
					<span className="text-muted-foreground italic">Not provided</span>
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
			const admin = row.original;

			return (
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost" className="h-8 w-8 p-0">
							<span className="sr-only">Open menu</span>
							<MoreHorizontal className="h-4 w-4" />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent align="end">
						<DropdownMenuItem onClick={() => actions.onView(admin.id)}>
							<Eye className="mr-2 h-4 w-4" />
							View Details
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => actions.onEdit(admin.id)}>
							<Pencil className="mr-2 h-4 w-4" />
							Edit Profile
						</DropdownMenuItem>
						<DropdownMenuItem
							onClick={() => actions.onChangePassword(admin.id)}
						>
							<Lock className="mr-2 h-4 w-4" />
							Change Password
						</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem
							onClick={() => actions.onDelete(admin.id)}
							className="text-red-600"
						>
							<Trash2 className="mr-2 h-4 w-4" />
							Delete
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			);
		},
		enableSorting: false,
		enableHiding: false,
	},
];
