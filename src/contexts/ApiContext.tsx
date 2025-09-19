import { createContext, useContext, type ReactNode } from "react";

interface ApiContextType {
	baseURL: string;
	isOnline: boolean;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

interface ApiProviderProps {
	children: ReactNode;
	baseURL?: string;
}

export const ApiProvider = ({
	children,
	baseURL = import.meta.env["VITE_APP_ENVIRONMENT"] === "production"
		? import.meta.env["VITE_API_BASE_URL_PRO"] || "https://api.medicalink.com"
		: import.meta.env["VITE_API_BASE_URL_DEV"] || "http://localhost:3000",
}: ApiProviderProps) => {
	const isOnline = navigator.onLine;

	const value: ApiContextType = {
		baseURL,
		isOnline,
	};

	return <ApiContext.Provider value={value}>{children}</ApiContext.Provider>;
};

export const useApiContext = () => {
	const context = useContext(ApiContext);
	if (context === undefined) {
		throw new Error("useApiContext must be used within an ApiProvider");
	}
	return context;
};
