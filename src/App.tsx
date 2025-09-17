import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "@tanstack/react-router";
import type { FunctionComponent } from "./common/types";
import type { TanstackRouter } from "./main";
import { Toaster } from "sonner";
// import { TanStackRouterDevelopmentTools } from "./components/utils/development-tools/TanStackRouterDevelopmentTools";
import { ThemeProvider } from "@/components/theme-provider";

const queryClient = new QueryClient();

type AppProps = { router: TanstackRouter };

const App = ({ router }: AppProps): FunctionComponent => {
	return (
		<ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
			<QueryClientProvider client={queryClient}>
				<RouterProvider router={router} />
				{/* <TanStackRouterDevelopmentTools
					initialIsOpen={false}
					position="bottom-right"
					router={router}
				/>
				<ReactQueryDevtools initialIsOpen={false} position="bottom" /> */}
				<Toaster position="bottom-right" />
			</QueryClientProvider>
		</ThemeProvider>
	);
};

export default App;
