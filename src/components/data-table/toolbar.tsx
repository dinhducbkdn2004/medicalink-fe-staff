import { useEffect, useState } from 'react'
import { Cross2Icon } from '@radix-ui/react-icons'
import { type Table } from '@tanstack/react-table'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/use-debounce'
import { DataTableFacetedFilter } from './faceted-filter'
import { DataTableViewOptions } from './view-options'

type DataTableToolbarProps<TData> = {
  table: Table<TData>
  searchPlaceholder?: string
  searchKey?: string
  filters?: {
    columnId: string
    title: string
    options: {
      label: string
      value: string
      icon?: React.ComponentType<{ className?: string }>
    }[]
  }[]
}

export function DataTableToolbar<TData>({
  table,
  searchPlaceholder = 'Filter...',
  searchKey,
  filters = [],
}: DataTableToolbarProps<TData>) {
  // Local state for search input (for immediate UI feedback)
  const [searchValue, setSearchValue] = useState(() => {
    if (searchKey) {
      return (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
    }
    return table.getState().globalFilter ?? ''
  })

  // Debounced search value (for API calls)
  const debouncedSearchValue = useDebounce(searchValue, 300)

  // Sync debounced value to table filter
  useEffect(() => {
    if (searchKey) {
      table.getColumn(searchKey)?.setFilterValue(debouncedSearchValue || undefined)
    } else {
      table.setGlobalFilter(debouncedSearchValue || undefined)
    }
  }, [debouncedSearchValue, searchKey, table])

  // Sync external filter changes back to local state
  // Only when URL changes externally (not from typing)
  useEffect(() => {
    const currentValue = searchKey
      ? (table.getColumn(searchKey)?.getFilterValue() as string) ?? ''
      : table.getState().globalFilter ?? ''
    
    // Only update if different AND not currently typing
    // Check if the current filter value is different from BOTH searchValue and debouncedSearchValue
    if (currentValue !== debouncedSearchValue && searchValue === debouncedSearchValue) {
      setSearchValue(currentValue)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchKey, table.getState().columnFilters, table.getState().globalFilter])

  const isFiltered =
    table.getState().columnFilters.length > 0 || table.getState().globalFilter

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(event) => setSearchValue(event.target.value)}
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {filters.map((filter) => {
            const column = table.getColumn(filter.columnId)
            if (!column) return null
            return (
              <DataTableFacetedFilter
                key={filter.columnId}
                column={column}
                title={filter.title}
                options={filter.options}
              />
            )
          })}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => {
              setSearchValue('')
              table.resetColumnFilters()
              table.setGlobalFilter('')
            }}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ms-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <DataTableViewOptions table={table} />
    </div>
  )
}
