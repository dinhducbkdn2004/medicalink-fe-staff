import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { WorkLocationsPage } from "@/pages/super-admin/work-locations/WorkLocationsPage";

export const Route = createFileRoute("/super-admin/work-locations")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<WorkLocationsPage />
		</RequireRole>
	),
});
