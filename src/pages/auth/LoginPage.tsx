import { useAuthRedirect } from "@/hooks/useAuthRedirect";
import { useAuthStatus } from "@/hooks/useAuthStatus";
import { Hospital } from "lucide-react";
import { Spinner } from "@/components/ui/shadcn-io/spinner";
import { LoginForm } from "@/components/forms/login-form";
import loginImage from "@/assets/images/login/bg-login.jpeg";

export const LoginPage = () => {
	const { isAuthenticated } = useAuthStatus();

	useAuthRedirect();

	if (isAuthenticated) {
		return (
			<div className="flex min-h-screen items-center justify-center">
				<Spinner size={48} className="text-primary" />
			</div>
		);
	}

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col gap-4 p-6 md:p-10">
				<div className="flex justify-center gap-2 md:justify-start">
					<a href="/" className="flex items-center gap-2">
						<div className="bg-primary text-primary-foreground flex size-7 items-center justify-center rounded-md">
							<Hospital className="size-5" />
						</div>
						<span className="text-primary text-lg font-bold">MedicalLink</span>
					</a>
				</div>
				<div className="flex flex-1 items-center justify-center">
					<div className="w-full max-w-xs space-y-4">
						<LoginForm />
					</div>
				</div>
			</div>
			<div className="bg-muted relative hidden lg:block">
				<img
					src={loginImage}
					alt="Medical professionals collaborating"
					className="absolute inset-0 h-full w-full object-cover"
				/>
			</div>
		</div>
	);
};
