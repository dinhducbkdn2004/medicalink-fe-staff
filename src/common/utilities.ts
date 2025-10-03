export const isProduction = import.meta.env.MODE === "production";
export const isDevelopment = import.meta.env.MODE === "development";

export const formatCurrency = (amount: number, currency = "VND"): string => {
	return new Intl.NumberFormat("vi-VN", {
		style: "currency",
		currency,
	}).format(amount);
};

