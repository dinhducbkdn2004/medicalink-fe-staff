import { createFileRoute } from "@tanstack/react-router";
import { AdminAccountsPage } from "@/pages/super-admin/AdminAccountsPage";

export const Route = createFileRoute("/super-admin/admin-accounts/")({
	component: AdminAccountsPage,
});
