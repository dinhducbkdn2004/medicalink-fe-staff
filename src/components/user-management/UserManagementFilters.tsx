import {
	EnhancedFilter,
	type EnhancedFilterParams,
} from "@/components/filters/EnhancedFilter";

interface UserManagementFiltersProps {
	filters: EnhancedFilterParams;
	onFiltersChange: (filters: EnhancedFilterParams) => void;
	showRole?: boolean;
	showGender?: boolean;
	className?: string;
}

export const UserManagementFilters = ({
	filters,
	onFiltersChange,
	showRole = true,
	showGender = false,
	className = "",
}: UserManagementFiltersProps) => {
	return (
		<EnhancedFilter
			filters={filters}
			onFiltersChange={onFiltersChange}
			showRole={showRole}
			showGender={showGender}
			showSort={true}
			className={className}
		/>
	);
};
