import { createFileRoute, redirect } from "@tanstack/react-router";
import { STORAGE_KEYS } from "@/constants/api";

export const Route = createFileRoute("/")({
	beforeLoad: () => {
		const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
		if (token) {
			const role = localStorage.getItem(STORAGE_KEYS.USER_ROLE);
			switch (role) {
				case "SUPER_ADMIN":
					return redirect({ to: "/super-admin/dashboard" });
				case "ADMIN":
					return redirect({ to: "/admin/dashboard" });
				case "DOCTOR":
					return redirect({ to: "/doctor/dashboard" });
				default:
					return redirect({ to: "/login" });
			}
		} else {
			return redirect({ to: "/login" });
		}
	},
});
