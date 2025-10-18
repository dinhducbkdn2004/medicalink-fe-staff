import { createFileRoute } from "@tanstack/react-router";
import { EnhancedWorkLocationsPage } from "@/pages/super-admin/work-locations/EnhancedWorkLocationsPage";

export const Route = createFileRoute("/super-admin/work-locations/")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<EnhancedWorkLocationsPage />
		//</RequireRole>
	),
});
