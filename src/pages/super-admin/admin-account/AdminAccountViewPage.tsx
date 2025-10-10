import { useNavigate, useParams } from "@tanstack/react-router";
import {
	ArrowLeft,
	Mail,
	Phone,
	Calendar,
	User,
	Shield,
	Edit,
	Clock,
	IdCard,
} from "lucide-react";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useStaffs } from "@/hooks/api/useStaffs";
import { Spinner } from "@/components/ui/spinner";

export function AdminAccountViewPage() {
	const params = useParams({ from: "/super-admin/admin-accounts/$id/view" });
	const id = params.id;
	const navigate = useNavigate();

	const { data: staffsData, isLoading } = useStaffs({
		page: 1,
		limit: 100,
	});

	const admin = staffsData?.data?.find((staff) => staff.id === id);

	const getInitials = (name: string) => {
		return name
			.split(" ")
			.map((n) => n[0])
			.join("")
			.toUpperCase()
			.slice(0, 2);
	};

	const handleBack = () => {
		void navigate({ to: "/super-admin/admin-accounts" });
	};

	const handleEdit = () => {
		void navigate({
			to: "/super-admin/admin-accounts/$id/edit",
			params: { id },
		});
	};

	if (isLoading) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={40} className="text-primary" />
			</div>
		);
	}

	if (!admin) {
		return (
			<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<h1 className="text-2xl font-bold">Admin Not Found</h1>
				</div>
				<Card>
					<CardContent className="p-6">
						<p className="text-muted-foreground">
							The admin account you're looking for doesn't exist or has been
							deleted.
						</p>
					</CardContent>
				</Card>
			</div>
		);
	}

	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			{/* Header */}
			<div className="flex items-center justify-between">
				<div className="flex items-center gap-2">
					<Button variant="ghost" size="icon" onClick={handleBack}>
						<ArrowLeft className="h-4 w-4" />
					</Button>
					<div>
						<h1 className="text-xl font-semibold">Administrator Profile</h1>
						<p className="text-muted-foreground text-sm">
							View and manage administrator account details
						</p>
					</div>
				</div>
				<Button onClick={handleEdit}>
					<Edit className="mr-2 h-4 w-4" />
					Edit Profile
				</Button>
			</div>

			<div className="grid gap-4 lg:grid-cols-3">
				{/* Left Column - Profile Summary */}
				<div className="lg:col-span-1">
					<Card>
						<CardHeader className="bg-muted/30">
							<div className="flex flex-col items-center text-center">
								<Avatar className="border-background h-20 w-20 border-2 shadow-md">
									<AvatarFallback className="bg-primary text-primary-foreground text-xl font-semibold">
										{getInitials(admin.fullName)}
									</AvatarFallback>
								</Avatar>
								<CardTitle className="mt-3 text-base">
									{admin.fullName}
								</CardTitle>
								<CardDescription className="mt-1 flex items-center gap-1.5">
									<Badge
										variant={
											admin.role === "SUPER_ADMIN" ? "default" : "secondary"
										}
										className="text-xs"
									>
										<Shield className="mr-1 h-3 w-3" />
										{admin.role === "SUPER_ADMIN"
											? "Super Admin"
											: "Administrator"}
									</Badge>
								</CardDescription>
							</div>
						</CardHeader>
						<CardContent className="pt-4">
							<div className="space-y-3">
								<div className="bg-muted/50 flex items-center gap-2 rounded-md p-2.5">
									<IdCard className="text-muted-foreground h-4 w-4 flex-shrink-0" />
									<div className="min-w-0 flex-1">
										<p className="text-muted-foreground text-xs">Account ID</p>
										<p className="truncate font-mono text-xs">
											{admin.id.slice(0, 12)}...
										</p>
									</div>
								</div>
								<div className="bg-muted/50 flex items-center gap-2 rounded-md p-2.5">
									<User className="text-muted-foreground h-4 w-4 flex-shrink-0" />
									<div className="flex-1">
										<p className="text-muted-foreground text-xs">Gender</p>
										<p className="text-sm">
											{admin.isMale ? "Male" : "Female"}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>

				{/* Right Column - Detailed Information */}
				<div className="space-y-4 lg:col-span-2">
					{/* Contact Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Mail className="h-4 w-4" />
								Contact Information
							</CardTitle>
							<CardDescription className="text-xs">
								Primary contact details for this administrator
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 md:grid-cols-2">
								<div className="space-y-1.5 rounded-md border p-3">
									<div className="flex items-center gap-2">
										<Mail className="text-muted-foreground h-3.5 w-3.5" />
										<p className="text-muted-foreground text-xs font-medium">
											EMAIL ADDRESS
										</p>
									</div>
									<p className="text-sm">{admin.email}</p>
								</div>
								<div className="space-y-1.5 rounded-md border p-3">
									<div className="flex items-center gap-2">
										<Phone className="text-muted-foreground h-3.5 w-3.5" />
										<p className="text-muted-foreground text-xs font-medium">
											PHONE NUMBER
										</p>
									</div>
									<p className="text-sm">
										{admin.phone || (
											<span className="text-muted-foreground italic">N/A</span>
										)}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Personal Information */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<User className="h-4 w-4" />
								Personal Information
							</CardTitle>
							<CardDescription className="text-xs">
								Personal details and demographics
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="grid gap-3 md:grid-cols-2">
								<div className="space-y-1.5 rounded-md border p-3">
									<div className="flex items-center gap-2">
										<Calendar className="text-muted-foreground h-3.5 w-3.5" />
										<p className="text-muted-foreground text-xs font-medium">
											DATE OF BIRTH
										</p>
									</div>
									<p className="text-sm">
										{admin.dateOfBirth ? (
											new Date(admin.dateOfBirth).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})
										) : (
											<span className="text-muted-foreground italic">N/A</span>
										)}
									</p>
								</div>
								<div className="space-y-1.5 rounded-md border p-3">
									<div className="flex items-center gap-2">
										<User className="text-muted-foreground h-3.5 w-3.5" />
										<p className="text-muted-foreground text-xs font-medium">
											GENDER
										</p>
									</div>
									<p className="text-sm">{admin.isMale ? "Male" : "Female"}</p>
								</div>
							</div>
						</CardContent>
					</Card>

					{/* Account Activity */}
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2 text-base">
								<Clock className="h-4 w-4" />
								Account Activity
							</CardTitle>
							<CardDescription className="text-xs">
								Account creation and modification history
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="space-y-3">
								<div className="flex items-start gap-2 rounded-md border p-3">
									<Calendar className="text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
									<div>
										<p className="text-muted-foreground text-xs font-medium">
											CREATED AT
										</p>
										<p className="mt-0.5 text-sm">
											{new Date(admin.createdAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
										<p className="text-muted-foreground mt-0.5 text-xs">
											{new Date(admin.createdAt).toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								</div>
								<div className="flex items-start gap-2 rounded-md border p-3">
									<Clock className="text-muted-foreground mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
									<div>
										<p className="text-muted-foreground text-xs font-medium">
											LAST UPDATED
										</p>
										<p className="mt-0.5 text-sm">
											{new Date(admin.updatedAt).toLocaleDateString("en-US", {
												year: "numeric",
												month: "long",
												day: "numeric",
											})}
										</p>
										<p className="text-muted-foreground mt-0.5 text-xs">
											{new Date(admin.updatedAt).toLocaleTimeString("en-US", {
												hour: "2-digit",
												minute: "2-digit",
											})}
										</p>
									</div>
								</div>
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
