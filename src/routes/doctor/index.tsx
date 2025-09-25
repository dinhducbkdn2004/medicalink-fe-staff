import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/doctor/")({
	beforeLoad: () => {
		return redirect({ to: "/doctor/dashboard" });
	},
});
