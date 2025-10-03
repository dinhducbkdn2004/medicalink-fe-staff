import { createFileRoute } from "@tanstack/react-router";
import { DoctorAccountEditPage } from "@/pages/super-admin/doctor-account/DoctorAccountEditPage";

export const Route = createFileRoute("/super-admin/doctor-accounts/$id/edit")({
	component: DoctorAccountEditPage,
});
