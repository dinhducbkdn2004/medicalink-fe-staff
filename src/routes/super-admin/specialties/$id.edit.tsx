import { createFileRoute } from "@tanstack/react-router";
import { SpecialtyEditPage } from "@/pages/super-admin/specialties/SpecialtyEditPage";

export const Route = createFileRoute("/super-admin/specialties/$id/edit")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<SpecialtyEditPage />
		//</RequireRole>
	),
});
