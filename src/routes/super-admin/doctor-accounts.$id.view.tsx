import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";
import { EnhancedDoctorProfilePage } from "@/pages/super-admin/doctor-account/EnhancedDoctorProfilePage";

const searchSchema = z.object({
	mode: z.enum(["view", "edit"]).optional().default("view"),
});

export const Route = createFileRoute("/super-admin/doctor-accounts/$id/view")({
	component: EnhancedDoctorProfilePage,
	validateSearch: searchSchema,
});
