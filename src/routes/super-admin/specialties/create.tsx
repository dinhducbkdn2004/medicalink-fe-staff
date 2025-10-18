import { createFileRoute } from "@tanstack/react-router";
import { SpecialtyCreatePage } from "@/pages/super-admin/specialties/SpecialtyCreatePage";

export const Route = createFileRoute("/super-admin/specialties/create")({
	component: () => (
		//<RequireRole roles={["SUPER_ADMIN"]}>
		<SpecialtyCreatePage />
		//</RequireRole>
	),
});
