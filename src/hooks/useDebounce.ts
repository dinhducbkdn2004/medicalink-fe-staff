import { useState, useEffect } from "react";

/**
 * Custom hook for debounced search functionality
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with value, debouncedValue, and setValue
 */
export function useDebounce<T>(initialValue: T, delay: number = 300) {
	const [value, setValue] = useState<T>(initialValue);
	const [debouncedValue, setDebouncedValue] = useState<T>(initialValue);

	useEffect(() => {
		const handler = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(handler);
		};
	}, [value, delay]);

	return {
		value,
		debouncedValue,
		setValue,
	};
}

/**
 * Specialized hook for search functionality with loading state
 * @param initialValue - Initial search value
 * @param delay - Debounce delay in milliseconds (default: 300ms)
 * @returns Object with search state and handlers
 */
export function useSearch(initialValue: string = "", delay: number = 300) {
	const { value, debouncedValue, setValue } = useDebounce(initialValue, delay);
	const [isSearching, setIsSearching] = useState(false);

	useEffect(() => {
		if (value !== debouncedValue) {
			setIsSearching(true);
		} else {
			setIsSearching(false);
		}
	}, [value, debouncedValue]);

	const clearSearch = () => {
		setValue("");
	};

	return {
		searchTerm: value,
		debouncedSearchTerm: debouncedValue,
		setSearchTerm: setValue,
		clearSearch,
		isSearching,
	};
}
