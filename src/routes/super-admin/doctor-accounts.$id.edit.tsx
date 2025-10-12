import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/super-admin/doctor-accounts/$id/edit")({
	beforeLoad: ({ params }) => {
		// Redirect to view page with edit mode
		throw redirect({
			to: "/super-admin/doctor-accounts/$id/view",
			params: { id: params.id },
			search: { mode: "edit" },
		});
	},
});
