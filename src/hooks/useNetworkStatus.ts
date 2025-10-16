import { useEffect, useState } from "react";
import { toastManager } from "@/lib/toastManager";

export const useNetworkStatus = () => {
	const [isOnline, setIsOnline] = useState<boolean>(navigator.onLine);
	const [wasOffline, setWasOffline] = useState<boolean>(false);

	useEffect(() => {
		const handleOnline = () => {
			setIsOnline(true);
			if (wasOffline) {
				toastManager.success("Connection restored - You are back online", {
					cooldown: 5000, // Show this for 5 seconds cooldown
				});
				setWasOffline(false);
			}
		};

		const handleOffline = () => {
			setIsOnline(false);
			setWasOffline(true);
			toastManager.error(
				"Connection lost - Please check your internet connection",
				{
					cooldown: 10000, // Show this for 10 seconds cooldown since it's critical
				}
			);
		};

		window.addEventListener("online", handleOnline);
		window.addEventListener("offline", handleOffline);

		// Cleanup
		return () => {
			window.removeEventListener("online", handleOnline);
			window.removeEventListener("offline", handleOffline);
		};
	}, [wasOffline]);

	return { isOnline };
};
