import { createFileRoute } from "@tanstack/react-router";
import { WorkLocationCreatePage } from "@/pages/super-admin/work-locations/WorkLocationCreatePage";

export const Route = createFileRoute("/super-admin/work-locations/create")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<WorkLocationCreatePage />
		//</RequireRole>
	),
});
