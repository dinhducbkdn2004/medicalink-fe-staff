import { createFileRoute } from "@tanstack/react-router";
import { SchedulesPage } from "@/pages/super-admin/SchedulesPage";

export const Route = createFileRoute("/super-admin/schedules")({
	component: SchedulesPage,
});
