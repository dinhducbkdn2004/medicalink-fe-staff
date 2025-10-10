import { createFileRoute } from "@tanstack/react-router";
import { EnhancedSpecialtiesPage } from "@/pages/super-admin/specialties/EnhancedSpecialtiesPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/specialties")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<EnhancedSpecialtiesPage />
		</RequireRole>
	),
});
