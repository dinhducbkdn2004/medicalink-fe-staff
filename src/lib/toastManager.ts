import { toast } from "sonner";

interface ToastManager {
	error: (
		message: string,
		options?: { dedupe?: boolean; cooldown?: number }
	) => void;
	success: (
		message: string,
		options?: { dedupe?: boolean; cooldown?: number }
	) => void;
	warning: (
		message: string,
		options?: { dedupe?: boolean; cooldown?: number }
	) => void;
	info: (
		message: string,
		options?: { dedupe?: boolean; cooldown?: number }
	) => void;
}

class ToastManagerImpl implements ToastManager {
	private toastHistory: Map<string, number> = new Map();
	private readonly DEFAULT_COOLDOWN = 3000; // 3 seconds

	private shouldShowToast(message: string, cooldown: number): boolean {
		const now = Date.now();
		const lastShown = this.toastHistory.get(message);

		if (!lastShown || now - lastShown > cooldown) {
			this.toastHistory.set(message, now);
			return true;
		}

		return false;
	}

	private cleanupOldEntries() {
		const now = Date.now();
		const MAX_AGE = 60000; // 1 minute

		for (const [message, timestamp] of this.toastHistory.entries()) {
			if (now - timestamp > MAX_AGE) {
				this.toastHistory.delete(message);
			}
		}
	}

	error(
		message: string,
		options: { dedupe?: boolean; cooldown?: number } = {}
	) {
		const { dedupe = true, cooldown = this.DEFAULT_COOLDOWN } = options;

		if (!dedupe || this.shouldShowToast(message, cooldown)) {
			toast.error(message);
			this.cleanupOldEntries();
		}
	}

	success(
		message: string,
		options: { dedupe?: boolean; cooldown?: number } = {}
	) {
		const { dedupe = true, cooldown = this.DEFAULT_COOLDOWN } = options;

		if (!dedupe || this.shouldShowToast(message, cooldown)) {
			toast.success(message);
			this.cleanupOldEntries();
		}
	}

	warning(
		message: string,
		options: { dedupe?: boolean; cooldown?: number } = {}
	) {
		const { dedupe = true, cooldown = this.DEFAULT_COOLDOWN } = options;

		if (!dedupe || this.shouldShowToast(message, cooldown)) {
			toast.warning(message);
			this.cleanupOldEntries();
		}
	}

	info(message: string, options: { dedupe?: boolean; cooldown?: number } = {}) {
		const { dedupe = true, cooldown = this.DEFAULT_COOLDOWN } = options;

		if (!dedupe || this.shouldShowToast(message, cooldown)) {
			toast.info(message);
			this.cleanupOldEntries();
		}
	}

	// Clear all toast history (useful for testing or reset)
	clear() {
		this.toastHistory.clear();
	}
}

export const toastManager = new ToastManagerImpl();
