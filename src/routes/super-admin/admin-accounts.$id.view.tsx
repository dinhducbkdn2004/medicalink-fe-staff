import { createFileRoute } from "@tanstack/react-router";
import { AdminAccountViewPage } from "@/pages/super-admin/AdminAccountViewPage";

export const Route = createFileRoute("/super-admin/admin-accounts/$id/view")({
	component: AdminAccountViewPage,
});
