import { createFileRoute } from "@tanstack/react-router";
import { DoctorAccountsPage } from "@/pages/super-admin/doctor-account/DoctorAccountsPage";

export const Route = createFileRoute("/super-admin/doctor-accounts/")({
	component: DoctorAccountsPage,
});
