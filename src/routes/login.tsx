import { createFileRoute } from "@tanstack/react-router";
import { LoginPage } from "@/pages/auth/login/LoginPage";

export const Route = createFileRoute("/login")({
	component: LoginPage,
});
