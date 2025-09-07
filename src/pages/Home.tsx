import { useTranslation } from "react-i18next";
import type { FunctionComponent } from "../common/types";
import { Button } from "@/components/ui/button";

export const Home = (): FunctionComponent => {
	const { t, i18n } = useTranslation();

	const onTranslateButtonClick = async (): Promise<void> => {
		if (i18n.resolvedLanguage === "en") {
			await i18n.changeLanguage("es");
		} else {
			await i18n.changeLanguage("en");
		}
	};

	return (
		<div className="min-h-screen bg-background flex flex-col justify-center items-center gap-8">
			<h1 className="text-foreground text-6xl font-bold">
				{t("home.greeting")}
			</h1>
			<div className="flex gap-4">
				<Button size="lg" variant="default" onClick={onTranslateButtonClick}>
					Translate
				</Button>
			</div>
		</div>
	);
};
