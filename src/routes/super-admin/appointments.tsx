import { createFileRoute } from "@tanstack/react-router";
import { AppointmentsPage } from "@/pages/super-admin/appointments/AppointmentsPage";

export const Route = createFileRoute("/super-admin/appointments")({
	component: AppointmentsPage,
});
