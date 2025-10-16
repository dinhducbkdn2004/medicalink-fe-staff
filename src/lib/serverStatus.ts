import { toastManager } from "@/lib/toastManager";
import { apiClient } from "@/api/core/client";

let serverStatusCheckInterval: NodeJS.Timeout | null = null;
let isServerDown = false;

export const startServerStatusMonitoring = () => {
	// Check server status every 30 seconds when there might be an issue
	if (serverStatusCheckInterval) {
		clearInterval(serverStatusCheckInterval);
	}

	serverStatusCheckInterval = setInterval(async () => {
		try {
			// Simple health check endpoint - you may need to adjust this based on your API
			await apiClient.get("/health", { timeout: 5000 });

			if (isServerDown) {
				isServerDown = false;
				toastManager.success(
					"Server connection restored - The system is back online",
					{
						cooldown: 5000,
					}
				);
				stopServerStatusMonitoring();
			}
		} catch {
			if (!isServerDown) {
				isServerDown = true;
				toastManager.error("Server unavailable - Attempting to reconnect...", {
					cooldown: 30000, // Only show this every 30 seconds
				});
			}
		}
	}, 30000);
};

export const stopServerStatusMonitoring = () => {
	if (serverStatusCheckInterval) {
		clearInterval(serverStatusCheckInterval);
		serverStatusCheckInterval = null;
	}
};

export const triggerServerDownCheck = () => {
	if (!isServerDown) {
		isServerDown = true;
		startServerStatusMonitoring();
	}
};
