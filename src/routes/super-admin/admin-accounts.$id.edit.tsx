import { createFileRoute } from "@tanstack/react-router";
import { AdminAccountEditPage } from "@/pages/super-admin/AdminAccountEditPage";

export const Route = createFileRoute("/super-admin/admin-accounts/$id/edit")({
	component: AdminAccountEditPage,
});
