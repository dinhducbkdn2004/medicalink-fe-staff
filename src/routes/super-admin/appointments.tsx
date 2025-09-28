import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsPage } from "@/pages/super-admin/AppointmentsPage";

export const Route = createFileRoute("/super-admin/appointments")({
	component: AppointmentsPage,
});
