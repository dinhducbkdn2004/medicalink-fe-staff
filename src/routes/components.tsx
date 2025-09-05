import { createFileRoute } from "@tanstack/react-router";
import { ComponentsShowcase } from "../pages/ComponentsShowcase";

export const Route = createFileRoute("/components")({
	component: ComponentsShowcase,
});
