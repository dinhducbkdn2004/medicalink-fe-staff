import { createFileRoute } from "@tanstack/react-router";
import { WorkLocationViewPage } from "@/pages/super-admin/work-locations/WorkLocationViewPage";

export const Route = createFileRoute("/super-admin/work-locations/$id/view")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<WorkLocationViewPage />
		//</RequireRole>
	),
});
