import { createFileRoute } from "@tanstack/react-router";
import { WorkLocationViewEditPage } from "@/pages/super-admin/work-locations/WorkLocationViewEditPage";

export const Route = createFileRoute("/super-admin/work-locations/$id")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
			<WorkLocationViewEditPage />
		//</RequireRole>
	),
});
