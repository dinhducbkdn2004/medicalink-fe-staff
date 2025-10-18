import { useNetworkStatus } from "@/hooks/useNetworkStatus";
import { WifiOff } from "lucide-react";

export const NetworkStatusIndicator = () => {
	const { isOnline } = useNetworkStatus();

	if (isOnline) {
		return null;
	}

	return (
		<div className="fixed top-4 left-1/2 z-50 w-auto min-w-72 -translate-x-1/2 transform">
			<div className="bg-destructive text-destructive-foreground border-destructive flex items-center gap-2 rounded-md border px-4 py-2">
				<WifiOff className="h-4 w-4" />
				<span className="font-medium">No internet connection</span>
			</div>
		</div>
	);
};
