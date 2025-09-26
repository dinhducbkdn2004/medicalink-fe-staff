import { createFileRoute } from "@tanstack/react-router";
import { RequireRole } from "@/components/guards/RequireRole";

export const Route = createFileRoute("/super-admin/work-locations")({
	component: () => (
		<RequireRole roles={["SUPER_ADMIN"]}>
			<div className="flex min-h-96 items-center justify-center">
				<div className="text-center">
					<h2 className="mb-2 text-2xl font-bold">Work Locations Management</h2>
					<p className="text-muted-foreground">
						This page is temporarily disabled during development
					</p>
				</div>
			</div>
		</RequireRole>
	),
});
