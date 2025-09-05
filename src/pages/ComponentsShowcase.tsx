import type { FunctionComponent } from "../common/types";
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

export const ComponentsShowcase = (): FunctionComponent => {
	return (
		<div className="min-h-screen bg-background p-8">
			<div className="max-w-4xl mx-auto space-y-8">
				<div className="text-center space-y-4">
					<h1 className="text-foreground text-4xl font-bold">
						shadcn/ui Components Showcase
					</h1>
					<p className="text-muted-foreground text-lg">
						Testing shadcn/ui components with Tailwind CSS v4.1
					</p>
				</div>

				{/* Buttons Section */}
				<Card>
					<CardHeader>
						<CardTitle>Buttons</CardTitle>
						<CardDescription>
							Different button variants and sizes
						</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="flex flex-wrap gap-4">
							<Button variant="default">Default</Button>
							<Button variant="secondary">Secondary</Button>
							<Button variant="destructive">Destructive</Button>
							<Button variant="outline">Outline</Button>
							<Button variant="ghost">Ghost</Button>
							<Button variant="link">Link</Button>
						</div>
						<div className="flex flex-wrap gap-4">
							<Button size="sm">Small</Button>
							<Button size="default">Default</Button>
							<Button size="lg">Large</Button>
							<Button size="icon">🎉</Button>
						</div>
					</CardContent>
				</Card>

				{/* Form Section */}
				<Card>
					<CardHeader>
						<CardTitle>Form Components</CardTitle>
						<CardDescription>Input fields with labels</CardDescription>
					</CardHeader>
					<CardContent className="space-y-4">
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="email">Email</Label>
							<Input id="email" placeholder="Enter your email" type="email" />
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="name">Full Name</Label>
							<Input id="name" placeholder="Enter your full name" type="text" />
						</div>
						<div className="grid w-full max-w-sm items-center gap-1.5">
							<Label htmlFor="password">Password</Label>
							<Input
								id="password"
								placeholder="Enter password"
								type="password"
							/>
						</div>
					</CardContent>
				</Card>

				{/* Cards Section */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
					<Card>
						<CardHeader>
							<CardTitle>Medical Records</CardTitle>
							<CardDescription>Manage patient medical records</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Access and update patient medical history, prescriptions, and
								treatment plans.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Appointments</CardTitle>
							<CardDescription>
								Schedule and manage appointments
							</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								Book, reschedule, and track patient appointments with healthcare
								providers.
							</p>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Analytics</CardTitle>
							<CardDescription>Healthcare analytics dashboard</CardDescription>
						</CardHeader>
						<CardContent>
							<p className="text-sm text-muted-foreground">
								View reports and analytics for patient care metrics and
								outcomes.
							</p>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
};
