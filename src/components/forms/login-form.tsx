import { useState } from "react";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useLogin } from "@/hooks/api";
import type { LoginRequest } from "@/types";
import { Spinner } from "@/components/ui/shadcn-io/spinner";

export function LoginForm({
	className,
	...props
}: React.ComponentProps<"div">) {
	const [credentials, setCredentials] = useState<LoginRequest>({
		email: "",
		password: "",
	});
	const loginMutation = useLogin();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { name, value } = e.target;
		setCredentials((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		loginMutation.mutate(credentials);
	};

	return (
		<div className={cn("flex flex-col gap-6", className)} {...props}>
			<Card>
				<CardHeader className="items-center">
					<CardTitle>WelCome Back</CardTitle>
					<CardDescription>
						Enter your email below to login to your account
					</CardDescription>
				</CardHeader>
				<CardContent>
					<form onSubmit={handleSubmit} className="flex flex-col gap-6">
						<div className="grid gap-3">
							<Label htmlFor="email">Email</Label>
							<Input
								id="email"
								name="email"
								type="email"
								placeholder="m@example.com"
								value={credentials.email}
								onChange={handleInputChange}
								required
								disabled={loginMutation.isPending}
							/>
						</div>
						<div className="grid gap-3">
							<div className="flex items-center">
								<Label htmlFor="password">Password</Label>
								<a
									href="/"
									className="ml-auto inline-block text-sm underline-offset-4 hover:underline"
								>
									Forgot your password?
								</a>
							</div>
							<Input
								id="password"
								name="password"
								type="password"
								placeholder="Enter your password"
								value={credentials.password}
								onChange={handleInputChange}
								required
								disabled={loginMutation.isPending}
							/>
							<div className="flex items-center">
								<input
									id="remember-me"
									name="remember-me"
									type="checkbox"
									className="text-primary focus:ring-primary h-3 w-3 rounded border-gray-300"
								/>
								<label
									htmlFor="remember-me"
									className="text-muted-foreground ml-2 block text-sm"
								>
									Remember me
								</label>
							</div>
						</div>

						<div className="flex flex-col gap-3">
							<Button
								type="submit"
								className="w-full cursor-pointer"
								disabled={loginMutation.isPending}
							>
								{loginMutation.isPending ? (
									<Spinner size={20} className="text-light" />
								) : (
									"Login"
								)}
							</Button>
						</div>
						<div className="mt-2 text-center text-sm">
							Don&apos;t have an account?{" "}
							<a href="/" className="underline underline-offset-4">
								Sign up
							</a>
						</div>
					</form>
				</CardContent>
			</Card>
		</div>
	);
}
