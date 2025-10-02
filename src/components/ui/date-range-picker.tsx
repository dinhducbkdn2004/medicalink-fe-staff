"use client";

import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";

interface DateRangePickerProps {
	readonly className?: string;
	readonly date?: DateRange | undefined;
	readonly onDateChange: (date: DateRange | undefined) => void;
	readonly placeholder?: string;
}

export function DateRangePicker({
	className,
	date,
	onDateChange,
	placeholder = "Pick a date range",
}: DateRangePickerProps) {
	return (
		<div className={cn("grid gap-2", className)}>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						id="date"
						variant={"outline"}
						size="sm"
						className={cn(
							"h-8 w-[200px] justify-start text-left text-xs font-normal",
							!date && "text-muted-foreground"
						)}
					>
						<CalendarIcon className="mr-2 h-4 w-4" />
						{date?.from ? (
							date.to ? (
								<>
									{format(date.from, "MMM dd")} - {format(date.to, "MMM dd")}
								</>
							) : (
								format(date.from, "MMM dd, y")
							)
						) : (
							<span>{placeholder}</span>
						)}
					</Button>
				</PopoverTrigger>
				<PopoverContent className="w-auto p-0" align="start">
					<Calendar
						mode="range"
						{...(date?.from && { defaultMonth: date.from })}
						selected={date}
						onSelect={onDateChange}
						numberOfMonths={2}
					/>
				</PopoverContent>
			</Popover>
		</div>
	);
}
