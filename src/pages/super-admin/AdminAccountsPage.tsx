import { useState } from "react";
import {
	Plus,
	Search,
	Filter,
	MoreHorizontal,
	Pencil,
	Trash2,
	Users,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
	DropdownMenuCheckboxItem,
	DropdownMenuLabel,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { AdminModal, DeleteConfirmationModal } from "@/components/modals";

// Mock data for demonstration
const mockAdminAccounts = [
	{
		id: "1",
		fullName: "Nguyễn Văn Admin",
		email: "admin1@medicalink.com",
		role: "ADMIN",
		status: "active",
		lastLogin: "2024-01-15 10:30:00",
		createdAt: "2024-01-01 00:00:00",
		avatar: null,
	},
	{
		id: "2",
		fullName: "Trần Thị Quản Lý",
		email: "admin2@medicalink.com",
		role: "ADMIN",
		status: "active",
		lastLogin: "2024-01-14 16:45:00",
		createdAt: "2024-01-02 00:00:00",
		avatar: null,
	},
	{
		id: "3",
		fullName: "Lê Văn Hệ Thống",
		email: "admin3@medicalink.com",
		role: "ADMIN",
		status: "inactive",
		lastLogin: "2024-01-10 09:15:00",
		createdAt: "2024-01-03 00:00:00",
		avatar: null,
	},
];

export function AdminAccountsPage() {
	const [searchTerm, setSearchTerm] = useState("");
	const [statusFilter, setStatusFilter] = useState<
		"all" | "active" | "inactive"
	>("all");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage] = useState(10);
	const [isLoading] = useState(false);
	const [showAdminModal, setShowAdminModal] = useState(false);
	const [showDeleteModal, setShowDeleteModal] = useState(false);
	const [selectedAdmin, setSelectedAdmin] = useState<
		(typeof mockAdminAccounts)[0] | null
	>(null);
	const [adminToDelete, setAdminToDelete] = useState<string | null>(null);
	const [isDeleting, setIsDeleting] = useState(false);

	const filteredAccounts = mockAdminAccounts.filter((account) => {
		const matchesSearch =
			account.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
			account.email.toLowerCase().includes(searchTerm.toLowerCase());

		const matchesStatus =
			statusFilter === "all" || account.status === statusFilter;

		return matchesSearch && matchesStatus;
	});

	const adminStats = {
		total: mockAdminAccounts.length,
		active: mockAdminAccounts.filter((a) => a.status === "active").length,
		inactive: mockAdminAccounts.filter((a) => a.status === "inactive").length,
	};
	const totalPages = Math.ceil(filteredAccounts.length / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const paginatedAccounts = filteredAccounts.slice(
		startIndex,
		startIndex + itemsPerPage
	);

	const handleCreateAdmin = () => {
		setSelectedAdmin(null);
		setShowAdminModal(true);
	};

	const handleEditAdmin = (adminId: string) => {
		const admin = mockAdminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setSelectedAdmin(admin);
			setShowAdminModal(true);
		}
	};

	const handleDeleteAdmin = (adminId: string) => {
		const admin = mockAdminAccounts.find((a) => a.id === adminId);
		if (admin) {
			setAdminToDelete(adminId);
			setShowDeleteModal(true);
		}
	};

	const getEmptyStateMessage = () => {
		if (searchTerm || statusFilter !== "all") {
			return "No admins found matching your search criteria.";
		}
		return "No admin accounts found.";
	};

	const confirmDeleteAdmin = async () => {
		if (!adminToDelete) return;

		try {
			setIsDeleting(true);
			// TODO: Implement actual API call
			await new Promise((resolve) => setTimeout(resolve, 1500));
			console.warn("Delete admin:", adminToDelete);

			// Close modal and reset state
			setShowDeleteModal(false);
			setAdminToDelete(null);
		} catch (error) {
			console.error("Failed to delete admin:", error);
		} finally {
			setIsDeleting(false);
		}
	};

	const handleConfirmDelete = () => {
		void confirmDeleteAdmin();
	};

	const getStatusBadge = (status: string) => {
		switch (status) {
			case "active":
				return (
					<Badge
						variant="default"
						className="bg-green-100 text-green-800 hover:bg-green-100"
					>
						Active
					</Badge>
				);
			case "inactive":
				return (
					<Badge variant="secondary" className="bg-gray-100 text-gray-800">
						Inactive
					</Badge>
				);
			default:
				return <Badge variant="outline">{status}</Badge>;
		}
	};

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Stats Cards */}
			<div className="grid gap-4 md:grid-cols-3">
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Total Admins
							</p>
							<p className="text-2xl font-bold">{adminStats.total}</p>
						</div>
						<Users className="text-muted-foreground h-8 w-8" />
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Active
							</p>
							<p className="text-2xl font-bold text-green-600">
								{adminStats.active}
							</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-green-100">
							<div className="h-3 w-3 rounded-full bg-green-600"></div>
						</div>
					</CardContent>
				</Card>
				<Card>
					<CardContent className="flex items-center justify-between p-6">
						<div>
							<p className="text-muted-foreground text-sm font-medium">
								Inactive
							</p>
							<p className="text-2xl font-bold text-gray-600">
								{adminStats.inactive}
							</p>
						</div>
						<div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100">
							<div className="h-3 w-3 rounded-full bg-gray-600"></div>
						</div>
					</CardContent>
				</Card>
			</div>

			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">Admin Accounts</h1>
					<p className="text-muted-foreground">
						Manage administrator accounts and permissions
					</p>
				</div>
				<Button onClick={handleCreateAdmin} className="gap-2">
					<Plus className="h-4 w-4" />
					Add Admin
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle>Admin Management</CardTitle>
					<CardDescription>
						A list of all administrator accounts in the system.
					</CardDescription>
				</CardHeader>
				<CardContent>
					{/* Search and Filter Bar */}
					<div className="mb-6 flex items-center gap-4">
						<div className="relative flex-1">
							<Search className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2" />
							<Input
								placeholder="Search by name or email..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="pl-10"
							/>
						</div>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" className="gap-2">
									<Filter className="h-4 w-4" />
									Filter
									{statusFilter !== "all" && (
										<span className="ml-1 rounded-sm bg-blue-100 px-1 text-xs text-blue-800">
											1
										</span>
									)}
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuLabel>Filter by Status</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem
									checked={statusFilter === "all"}
									onCheckedChange={() => setStatusFilter("all")}
								>
									All Status
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={statusFilter === "active"}
									onCheckedChange={() => setStatusFilter("active")}
								>
									Active Only
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={statusFilter === "inactive"}
									onCheckedChange={() => setStatusFilter("inactive")}
								>
									Inactive Only
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					{/* Table */}
					<div className="rounded-md border">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>Admin</TableHead>
									<TableHead>Email</TableHead>
									<TableHead>Status</TableHead>
									<TableHead>Last Login</TableHead>
									<TableHead>Created</TableHead>
									<TableHead className="w-[70px]">Actions</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{isLoading ? (
									// Loading skeletons
									Array.from({ length: 3 }, (_, index) => (
										<TableRow key={`admin-skeleton-${Date.now()}-${index}`}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Skeleton className="h-10 w-10 rounded-full" />
													<div>
														<Skeleton className="mb-1 h-4 w-[120px]" />
														<Skeleton className="h-3 w-[80px]" />
													</div>
												</div>
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[200px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-6 w-[60px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[140px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-4 w-[100px]" />
											</TableCell>
											<TableCell>
												<Skeleton className="h-8 w-8" />
											</TableCell>
										</TableRow>
									))
								) : filteredAccounts.length === 0 ? (
									<TableRow>
										<TableCell colSpan={6} className="h-24 text-center">
											{getEmptyStateMessage()}
										</TableCell>
									</TableRow>
								) : (
									paginatedAccounts.map((admin) => (
										<TableRow key={admin.id}>
											<TableCell>
												<div className="flex items-center space-x-3">
													<Avatar className="h-10 w-10">
														<AvatarImage src={admin.avatar ?? undefined} />
														<AvatarFallback>
															{getInitials(admin.fullName)}
														</AvatarFallback>
													</Avatar>
													<div>
														<div className="font-medium">{admin.fullName}</div>
														<div className="text-muted-foreground text-sm">
															{admin.role}
														</div>
													</div>
												</div>
											</TableCell>
											<TableCell>{admin.email}</TableCell>
											<TableCell>{getStatusBadge(admin.status)}</TableCell>
											<TableCell className="text-sm">
												{new Date(admin.lastLogin).toLocaleString()}
											</TableCell>
											<TableCell className="text-sm">
												{new Date(admin.createdAt).toLocaleDateString()}
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
															onClick={() => handleEditAdmin(admin.id)}
														>
															<Pencil className="mr-2 h-4 w-4" />
															Edit
														</DropdownMenuItem>
														<DropdownMenuSeparator />
														<DropdownMenuItem
															onClick={() => handleDeleteAdmin(admin.id)}
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
					<div className="flex items-center justify-between space-x-2 py-4">
						<div className="text-muted-foreground text-sm">
							Showing {startIndex + 1} to{" "}
							{Math.min(startIndex + itemsPerPage, filteredAccounts.length)} of{" "}
							{filteredAccounts.length} admin(s)
							{statusFilter !== "all" && ` (filtered by ${statusFilter})`}
						</div>
						<div className="flex items-center space-x-2">
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage <= 1}
								onClick={() => setCurrentPage(currentPage - 1)}
							>
								Previous
							</Button>
							<span className="text-sm">
								Page {currentPage} of {Math.max(1, totalPages)}
							</span>
							<Button
								variant="outline"
								size="sm"
								disabled={currentPage >= totalPages}
								onClick={() => setCurrentPage(currentPage + 1)}
							>
								Next
							</Button>
						</div>
					</div>
				</CardContent>
			</Card>

			{/* Admin Modal */}
			<AdminModal
				open={showAdminModal}
				onOpenChange={setShowAdminModal}
				admin={selectedAdmin}
			/>

			{/* Delete Confirmation Modal */}
			<DeleteConfirmationModal
				open={showDeleteModal}
				onOpenChange={setShowDeleteModal}
				onConfirm={handleConfirmDelete}
				title="Delete Admin Account"
				description="Are you sure you want to delete this admin account? This action cannot be undone."
				itemName={
					adminToDelete
						? mockAdminAccounts.find((a) => a.id === adminToDelete)?.fullName ||
							"Unknown Admin"
						: ""
				}
				isLoading={isDeleting}
			/>
		</div>
	);
}
