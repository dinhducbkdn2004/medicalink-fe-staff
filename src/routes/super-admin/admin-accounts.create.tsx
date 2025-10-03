import { createFileRoute } from "@tanstack/react-router";
import { AdminCreatePage } from "@/pages/super-admin/admin-account/AdminCreatePage";

export const Route = createFileRoute("/super-admin/admin-accounts/create")({
	component: AdminCreatePage,
});
