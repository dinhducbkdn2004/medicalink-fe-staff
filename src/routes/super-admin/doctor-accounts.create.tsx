import { createFileRoute } from "@tanstack/react-router";
import { DoctorCreatePage } from "@/pages/super-admin/doctor-account/DoctorCreatePage";

export const Route = createFileRoute("/super-admin/doctor-accounts/create")({
	component: DoctorCreatePage,
});
