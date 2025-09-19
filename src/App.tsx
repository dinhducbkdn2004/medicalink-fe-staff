import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
import type { TanstackRouter } from "./main";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient({
	defaultOptions: {
		queries: {
			retry: (failureCount, error: any) => {
				if (
					error?.response?.status === 401 ||
					error?.response?.status === 403 ||
					error?.response?.status === 404
				) {
					return false;
				}
				return failureCount < 1;
			},
			retryDelay: 2000,
			staleTime: 1000 * 60 * 5,
			gcTime: 1000 * 60 * 10,
			refetchOnWindowFocus: false,
			refetchOnMount: false,
			refetchOnReconnect: false,
		},
		mutations: {
			retry: false,
		},
	},
});

if (typeof window !== "undefined") {
	(window as any).queryClient = queryClient;
}

type AppProps = { router: TanstackRouter };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				<Toaster position="bottom-right" />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
