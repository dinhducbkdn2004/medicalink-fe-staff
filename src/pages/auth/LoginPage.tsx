import { useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "@/contexts";
import { Hospital } from "lucide-react";
import { LoginForm } from "@/components/forms/login-form";
import loginImage from "@/assets/images/login/bg-login.jpeg";

export const LoginPage = () => {
	const { isAuthenticated, user } = useAuth();
	const navigate = useNavigate();

	useEffect(() => {
		if (isAuthenticated && user) {
			switch (user.role) {
				case "SUPER_ADMIN":
					void navigate({ to: "/super-admin/dashboard" });
					break;
				case "ADMIN":
					void navigate({ to: "/admin/dashboard" });
					break;
				case "DOCTOR":
					void navigate({ to: "/doctor/dashboard" });
					break;
				default:
					void navigate({ to: "/" });
			}
		}
	}, [isAuthenticated, user, navigate]);

	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<div className="border-primary h-32 w-32 animate-spin rounded-full border-b-2"></div>
			</div>
		);
	}

	return (
		<>
			<div className="grid min-h-svh lg:grid-cols-2">
				<div className="flex flex-col gap-4 p-6 md:p-10">
					<div className="flex justify-center gap-2 md:justify-start">
						<a href="/" className="flex items-center gap-2">
							<div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
								<Hospital className="size-5" />
							</div>
							<span className="text-primary text-lg font-bold">
								MedicalLink
							</span>
						</a>
					</div>
					<div className="flex flex-1 items-center justify-center">
						<div className="w-full max-w-xs">
							<LoginForm />
						</div>
					</div>
				</div>
				<div className="bg-muted relative hidden lg:block">
					<img
						src={loginImage}
						alt="Medical professionals collaborating"
						className="absolute inset-0 h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
					/>
				</div>
			</div>
		</>
	);
};
