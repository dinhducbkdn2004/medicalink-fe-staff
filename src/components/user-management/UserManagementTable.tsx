import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
	MoreHorizontal,
	Edit,
	Trash2,
	UserCheck,
	UserX,
	Mail,
	Phone,
} from "lucide-react";
import { format } from "date-fns";
import type { StaffAccount } from "@/types";

interface UserManagementTableProps {
	data: StaffAccount[];
	isLoading: boolean;
	error: Error | null;
	pagination: {
		pageIndex: number;
		pageSize: number;
		pageCount: number;
	};
	onPageChange: (pageIndex: number) => void;
	onPageSizeChange: (pageSize: number) => void;
	onEditUser: (user: StaffAccount) => void;
	onDeleteUser: (user: StaffAccount) => void;
}

const getRoleBadgeColor = (role: string) => {
	switch (role) {
		case "SUPER_ADMIN":
			return "bg-red-100 text-red-800 border-red-200 dark:bg-red-900 dark:text-red-200";
		case "ADMIN":
			return "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900 dark:text-blue-200";
		case "DOCTOR":
			return "bg-green-100 text-green-800 border-green-200 dark:bg-green-900 dark:text-green-200";
		default:
			return "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-900 dark:text-gray-200";
	}
};

const UserTableSkeleton = () => (
	<div className="space-y-3">
		{Array.from({ length: 5 }).map((_, i) => (
			<div key={i} className="flex items-center space-x-4 p-4">
				<Skeleton className="h-10 w-10 rounded-full" />
				<div className="flex-1 space-y-2">
					<Skeleton className="h-4 w-[200px]" />
					<Skeleton className="h-3 w-[150px]" />
				</div>
				<Skeleton className="h-6 w-[80px]" />
				<Skeleton className="h-8 w-8" />
			</div>
		))}
	</div>
);

export const UserManagementTable = ({
	data,
	isLoading,
	error,
	pagination,
	onPageChange,
	onPageSizeChange,
	onEditUser,
	onDeleteUser,
}: UserManagementTableProps) => {
	if (error) {
		return (
			<Card>
				<CardContent className="p-6">
					<div className="text-center text-red-600">
						<p className="font-medium">Error loading users</p>
						<p className="text-muted-foreground mt-1 text-sm">
							{error.message}
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center justify-between">
					<span>System Users</span>
					<span className="text-muted-foreground text-sm font-normal">
						{data.length} users
					</span>
				</CardTitle>
			</CardHeader>
			<CardContent>
				{isLoading ? (
					<UserTableSkeleton />
				) : (
					<>
						<div className="rounded-md border">
							<Table>
								<TableHeader>
									<TableRow>
										<TableHead>User</TableHead>
										<TableHead>Role</TableHead>
										<TableHead>Contact</TableHead>
										<TableHead>Created</TableHead>
										<TableHead>Status</TableHead>
										<TableHead className="w-[50px]"></TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{data.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="py-8 text-center">
												<div className="text-muted-foreground">
													<UserX className="mx-auto mb-2 h-8 w-8" />
													<p>No users found</p>
													<p className="text-sm">
														Try adjusting your search criteria
													</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										data.map((user) => (
											<TableRow key={user.id}>
												<TableCell>
													<div className="flex items-center space-x-3">
														<Avatar className="h-8 w-8">
															<AvatarFallback className="text-xs">
																{user.fullName
																	.split(" ")
																	.map((n) => n[0])
																	.join("")
																	.toUpperCase()}
															</AvatarFallback>
														</Avatar>
														<div>
															<p className="text-sm font-medium">
																{user.fullName}
															</p>
															<p className="text-muted-foreground text-xs">
																{user.email}
															</p>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<Badge
														variant="outline"
														className={getRoleBadgeColor(user.role)}
													>
														{user.role.replace("_", " ")}
													</Badge>
												</TableCell>
												<TableCell>
													<div className="space-y-1">
														{user.phone && (
															<div className="text-muted-foreground flex items-center space-x-1 text-xs">
																<Phone className="h-3 w-3" />
																<span>{user.phone}</span>
															</div>
														)}
														<div className="text-muted-foreground flex items-center space-x-1 text-xs">
															<Mail className="h-3 w-3" />
															<span>{user.email}</span>
														</div>
													</div>
												</TableCell>
												<TableCell className="text-muted-foreground text-sm">
													{format(new Date(user.createdAt), "MMM dd, yyyy")}
												</TableCell>
												<TableCell>
													<div className="flex items-center space-x-1">
														<UserCheck className="h-4 w-4 text-green-600" />
														<span className="text-sm text-green-600">
															Active
														</span>
													</div>
												</TableCell>
												<TableCell>
													<DropdownMenu>
														<DropdownMenuTrigger asChild>
															<Button variant="ghost" className="h-8 w-8 p-0">
																<MoreHorizontal className="h-4 w-4" />
															</Button>
														</DropdownMenuTrigger>
														<DropdownMenuContent align="end">
															<DropdownMenuItem
																onClick={() => onEditUser(user)}
															>
																<Edit className="mr-2 h-4 w-4" />
																Edit
															</DropdownMenuItem>
															<DropdownMenuItem
																onClick={() => onDeleteUser(user)}
																className="text-red-600"
															>
																<Trash2 className="mr-2 h-4 w-4" />
																Delete
															</DropdownMenuItem>
														</DropdownMenuContent>
													</DropdownMenu>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>

						{/* Pagination */}
						<div className="flex items-center justify-between pt-4">
							<div className="flex items-center space-x-2">
								<span className="text-muted-foreground text-sm">
									Rows per page:
								</span>
								<select
									value={pagination.pageSize}
									onChange={(e) => onPageSizeChange(Number(e.target.value))}
									className="rounded border px-2 py-1 text-sm"
								>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
								</select>
							</div>

							<div className="flex items-center space-x-2">
								<Button
									variant="outline"
									size="sm"
									onClick={() => onPageChange(pagination.pageIndex - 1)}
									disabled={pagination.pageIndex === 0}
								>
									Previous
								</Button>
								<span className="text-sm">
									Page {pagination.pageIndex + 1} of {pagination.pageCount}
								</span>
								<Button
									variant="outline"
									size="sm"
									onClick={() => onPageChange(pagination.pageIndex + 1)}
									disabled={pagination.pageIndex >= pagination.pageCount - 1}
								>
									Next
								</Button>
							</div>
						</div>
					</>
				)}
			</CardContent>
		</Card>
	);
};
