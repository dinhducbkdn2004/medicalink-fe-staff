import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";
import { SpecialtyViewEditPage } from "@/pages/super-admin/specialties/SpecialtyViewEditPage";

export const Route = createFileRoute("/super-admin/specialties/$id")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<SpecialtyViewEditPage />
		</RequireRole>
	),
});
