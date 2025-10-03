import { createFileRoute } from "@tanstack/react-router";
import { DoctorAccountViewPage } from "@/pages/super-admin/doctor-account/DoctorAccountViewPage";

export const Route = createFileRoute("/super-admin/doctor-accounts/$id/view")({
	component: DoctorAccountViewPage,
});
