import { useLocation, Link } from "@tanstack/react-router";
import {
	Breadcrumb,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbList,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

interface BreadcrumbItemType {
	label: string;
	href?: string;
	isCurrentPage?: boolean;
}

const pathLabelMap: Record<string, string> = {
	"/admin": "Dashboard",
	"/super-admin": "Dashboard",
	"/doctor": "Dashboard",
	"/admin/admin-accounts": "Admin Accounts",
	"/admin/doctor-accounts": "Doctor Accounts",
	"/admin/specialties": "Specialties",
	"/admin/work-locations": "Work Locations",
	"/admin/schedules": "Schedules",
	"/admin/appointments": "Appointments",
	"/super-admin/admin-accounts": "Admin Accounts",
	"/super-admin/doctor-accounts": "Doctor Accounts",
	"/super-admin/specialties": "Specialties",
	"/super-admin/work-locations": "Work Locations",
	"/super-admin/schedules": "Schedules",
	"/super-admin/appointments": "Appointments",
	"/doctor/calendar": "Calendar",
	"/doctor/appointments": "My Appointments",
	"/doctor/schedule": "My Schedule",
};

const createActionMap: Record<string, string> = {
	"/admin/admin-accounts/create": "Create Admin",
	"/admin/doctor-accounts/create": "Create Doctor",
	"/admin/specialties/create": "Create Specialty",
	"/admin/work-locations/create": "Create Work Location",
	"/super-admin/admin-accounts/create": "Create Admin",
	"/super-admin/doctor-accounts/create": "Create Doctor",
	"/super-admin/specialties/create": "Create Specialty",
	"/super-admin/work-locations/create": "Create Work Location",
};

function generateBreadcrumbs(pathname: string): BreadcrumbItemType[] {
	const segments = pathname.split("/").filter(Boolean);
	const breadcrumbs: BreadcrumbItemType[] = [];

	// Always start with home
	if (segments.length > 0) {
		const homeSegment = `/${segments[0]}`;
		const homeLabel = pathLabelMap[homeSegment];
		if (homeLabel) {
			breadcrumbs.push({
				label: homeLabel,
				href: homeSegment,
			});
		}
	}

	// Build path progressively
	let currentPath = "";
	for (let i = 1; i < segments.length; i++) {
		currentPath += `/${segments.slice(0, i + 1).join("/")}`;

		// Check if this is a create action
		if (segments[i] === "create") {
			const createLabel = createActionMap[currentPath];
			if (createLabel) {
				breadcrumbs.push({
					label: createLabel,
					isCurrentPage: true,
				});
				break;
			}
		}

		// Check if we have a label for this path
		const label = pathLabelMap[currentPath];
		if (label) {
			const isLastSegment = i === segments.length - 1;
			if (isLastSegment) {
				breadcrumbs.push({
					label,
					isCurrentPage: true,
				});
			} else {
				breadcrumbs.push({
					label,
					href: currentPath,
				});
			}
		}
	}

	return breadcrumbs;
}

export function NavigationBreadcrumb() {
	const location = useLocation();
	const breadcrumbs = generateBreadcrumbs(location.pathname);

	if (breadcrumbs.length <= 1) {
		return null;
	}

	return (
		<Breadcrumb>
			<BreadcrumbList>
				{breadcrumbs.map((item, index) => {
					const key = `breadcrumb-${item.label.replace(/\s+/g, "-")}-${index}`;
					return (
						<div key={key} className="flex items-center">
							<BreadcrumbItem>
								{item.isCurrentPage ? (
									<BreadcrumbPage>{item.label}</BreadcrumbPage>
								) : (
									<BreadcrumbLink asChild>
										<Link to={item.href!} className="flex items-center gap-1">
											{item.label}
										</Link>
									</BreadcrumbLink>
								)}
							</BreadcrumbItem>
							{index < breadcrumbs.length - 1 && <BreadcrumbSeparator />}
						</div>
					);
				})}
			</BreadcrumbList>
		</Breadcrumb>
	);
}
