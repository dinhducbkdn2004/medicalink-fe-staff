import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/")({
	beforeLoad: () => {
		return redirect({ to: "/super-admin/dashboard" });
	},
});
