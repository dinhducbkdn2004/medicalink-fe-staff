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
	baseURL = "https://medicalink-be.onrender.com",
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
