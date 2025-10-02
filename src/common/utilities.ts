export const isProduction = import.meta.env.MODE === "production";
export const isDevelopment = import.meta.env.MODE === "development";

export const formatCurrency = (amount: number, currency = "VND"): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency,
	}).format(amount);
};

export const formatDate = (
	date: string | Date,
	options?: Intl.DateTimeFormatOptions
): string => {
	const dateObj = typeof date === "string" ? new Date(date) : date;
	return new Intl.DateTimeFormat("vi-VN", {
		year: "numeric",
		month: "long",
		day: "numeric",
		...options,
	}).format(dateObj);
};

export const formatDateTime = (date: string | Date): string => {
	return formatDate(date, {
		year: "numeric",
		month: "short",
		day: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

export const isValidEmail = (email: string): boolean => {
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return emailRegex.test(email);
};

export const isValidPhone = (phone: string): boolean => {
	const phoneRegex = /^(\+84|0)[0-9]{9,10}$/;
	return phoneRegex.test(phone);
};

export const capitalize = (str: string): string => {
	return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text: string, maxLength: number): string => {
	if (text.length <= maxLength) return text;
	return text.slice(0, maxLength) + "...";
};

export const groupBy = <T, K extends keyof T>(
	array: T[],
	key: K
): Record<string, T[]> => {
	return array.reduce(
		(groups, item) => {
			const group = String(item[key]);
			groups[group] = groups[group] || [];
			groups[group].push(item);
			return groups;
		},
		{} as Record<string, T[]>
	);
};

export const delay = (ms: number): Promise<void> => {
	return new Promise((resolve) => setTimeout(resolve, ms));
};

export const safeJsonParse = <T>(str: string, fallback: T): T => {
	try {
		return JSON.parse(str) as T;
	} catch {
		return fallback;
	}
};
