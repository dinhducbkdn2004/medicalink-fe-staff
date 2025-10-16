import { createFileRoute } from "@tanstack/react-router";
import { WorkLocationEditPage } from "@/pages/super-admin/work-locations/WorkLocationEditPage";

export const Route = createFileRoute("/super-admin/work-locations/$id/edit")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<WorkLocationEditPage />
		//</RequireRole>
	),
});
