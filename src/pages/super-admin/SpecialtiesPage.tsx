import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Stethoscope } from "lucide-react";

export function SpecialtiesPage() {
	return (
		<div className="flex flex-1 flex-col gap-4 p-4 pt-0">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-2xl font-bold tracking-tight">
						Medical Specialties
					</h1>
					<p className="text-muted-foreground">
						Manage medical specialties and their configurations
					</p>
				</div>
				<Button className="gap-2">
					<Plus className="h-4 w-4" />
					Add Specialty
				</Button>
			</div>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Stethoscope className="h-5 w-5" />
						Specialties Management
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
						{[
							"Cardiology",
							"Pediatrics",
							"Neurology",
							"Orthopedics",
							"Dermatology",
							"Psychiatry",
						].map((specialty) => (
							<Card key={specialty} className="p-4">
								<div className="flex items-center justify-between">
									<div>
										<h3 className="font-medium">{specialty}</h3>
										<p className="text-muted-foreground text-sm">
											Active specialty
										</p>
									</div>
									<Stethoscope className="text-muted-foreground h-4 w-4" />
								</div>
							</Card>
						))}
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
