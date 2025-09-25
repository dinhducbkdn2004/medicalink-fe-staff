import { createFileRoute } from "@tanstack/react-router";
import { SpecialtiesPage } from "@/pages/super-admin/SpecialtiesPage";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/specialties")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<SpecialtiesPage />
		</RequireRole>
	),
});
