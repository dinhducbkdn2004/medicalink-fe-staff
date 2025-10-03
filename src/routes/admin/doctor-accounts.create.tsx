import { createFileRoute } from "@tanstack/react-router";
import { DoctorCreatePage } from "@/pages/admin/doctor-accounts/DoctorCreatePage";

export const Route = createFileRoute("/admin/doctor-accounts/create")({
	component: DoctorCreatePage,
});
