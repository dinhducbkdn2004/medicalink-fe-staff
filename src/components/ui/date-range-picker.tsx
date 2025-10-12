"use client";

import { CalendarIcon, X, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import {
	format,
	subDays,
	startOfMonth,
	endOfMonth,
	startOfYear,
	endOfYear,
} from "date-fns";
import { DateRange } from "react-day-picker";
import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

export type SortDirection = "asc" | "desc" | null;

interface DateRangePickerProps {
	className?: string;
	date?: DateRange | undefined;
	onDateChange: (date: DateRange | undefined) => void;
	placeholder?: string;
	showPresets?: boolean;
	showSort?: boolean;
	sortDirection?: SortDirection;
	onSortChange?: (direction: SortDirection) => void;
}

const presets = [
	{
		label: "Today",
		getValue: () => ({ from: new Date(), to: new Date() }),
	},
	{
		label: "Last 7 days",
		getValue: () => ({ from: subDays(new Date(), 6), to: new Date() }),
	},
	{
		label: "Last 30 days",
		getValue: () => ({ from: subDays(new Date(), 29), to: new Date() }),
	},
	{
		label: "This month",
		getValue: () => ({
			from: startOfMonth(new Date()),
			to: endOfMonth(new Date()),
		}),
	},
	{
		label: "This year",
		getValue: () => ({
			from: startOfYear(new Date()),
			to: endOfYear(new Date()),
		}),
	},
];

export function DateRangePicker({
	className,
	date,
	onDateChange,
	placeholder = "Select date range",
	showPresets = true,
	showSort = true,
	sortDirection = null,
	onSortChange,
}: DateRangePickerProps) {
	const handleClear = () => {
		onDateChange(undefined);
		onSortChange?.(null);
	};

	const toggleSort = () => {
		if (!onSortChange) return;
		onSortChange(
			sortDirection === null ? "asc" : sortDirection === "asc" ? "desc" : null
		);
	};

	const getSortIcon = () => {
		if (sortDirection === "asc") return <ArrowUp className="h-4 w-4" />;
		if (sortDirection === "desc") return <ArrowDown className="h-4 w-4" />;
		return <ArrowUpDown className="h-4 w-4" />;
	};

	return (
		<div className={cn("flex items-center gap-1.5", className)}>
			{/* Date Picker */}
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant="outline"
						size="sm"
						className={cn(
							"h-8 min-w-[120px] justify-start px-2.5 text-left text-sm font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4 shrink-0" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "dd/MM/yyyy")} –{" "}
									{format(date.to, "dd/MM/yyyy")}
								</>
							) : (
								format(date.from, "dd/MM/yyyy")
							)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<div className="flex">
						{showPresets && (
							<div className="w-[120px] border-r p-3">
								<p className="text-muted-foreground mb-2 text-xs font-medium tracking-wide uppercase">
									Quick
								</p>
								<div className="space-y-1">
									{presets.map((preset) => (
										<Button
											key={preset.label}
											variant="ghost"
											size="sm"
											className="w-full justify-start text-xs font-normal"
											onClick={() => onDateChange(preset.getValue())}
										>
											{preset.label}
										</Button>
									))}
								</div>
							</div>
						)}
						<div className="p-2">
							<Calendar
								mode="range"
								numberOfMonths={2}
								selected={date}
								onSelect={onDateChange}
								{...(date?.from && { defaultMonth: date.from })}
							/>
						</div>
					</div>
				</PopoverContent>
			</Popover>

			{/* Sort Button */}
			{showSort && onSortChange && (
				<Button
					variant="outline"
					size="sm"
					className={cn(
						"flex h-9 w-9 items-center justify-center",
						sortDirection && "bg-accent/50"
					)}
					onClick={toggleSort}
					title={
						sortDirection === "asc"
							? "Sort ascending"
							: sortDirection === "desc"
								? "Sort descending"
								: "Sort by date"
					}
				>
					{getSortIcon()}
				</Button>
			)}

			{(date?.from || date?.to || sortDirection) && (
				<Button
					variant="ghost"
					size="sm"
					className="text-muted-foreground hover:text-foreground flex h-9 w-9 items-center justify-center"
					onClick={handleClear}
					title="Clear filter"
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
