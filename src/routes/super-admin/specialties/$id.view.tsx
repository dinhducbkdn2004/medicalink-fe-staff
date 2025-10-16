import { createFileRoute } from "@tanstack/react-router";
import { SpecialtyViewPage } from "@/pages/super-admin/specialties/SpecialtyViewPage";

export const Route = createFileRoute("/super-admin/specialties/$id/view")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<SpecialtyViewPage />
		//</RequireRole>
	),
});
