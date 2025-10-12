import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { EnhancedWorkLocationsPage } from "@/pages/super-admin/work-locations/EnhancedWorkLocationsPage";

export const Route = createFileRoute("/super-admin/work-locations")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<EnhancedWorkLocationsPage />
		</RequireRole>
	),
});
