import { useEffect, useState } from 'react'
import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { Check, ChevronsUpDown, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from '@/components/ui/command'
import { Input } from '@/components/ui/input'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBlogCategories } from '../data/use-blog-categories'

// Status options
const statuses = [
  { label: 'Draft', value: 'DRAFT' },
  { label: 'Published', value: 'PUBLISHED' },
  { label: 'Archived', value: 'ARCHIVED' },
]

// Sort options
const sortOptions = [
  { label: 'Newest', value: 'createdAt.desc' },
  { label: 'Oldest', value: 'createdAt.asc' },
  { label: 'Most Viewed', value: 'viewCount.desc' },
  { label: 'Name A-Z', value: 'title.asc' },
  { label: 'Name Z-A', value: 'title.desc' },
]

const route = getRouteApi('/_authenticated/blogs/list')

export function BlogFilters() {
  const navigate = useNavigate()
  const search = route.useSearch()

  // @ts-ignore
  const { data: categoriesData } = useBlogCategories({ limit: 100 })
  const categories = Array.isArray(categoriesData)
    ? categoriesData
    : (categoriesData as any)?.data || []

  const [searchTerm, setSearchTerm] = useState(search.search || '')

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (search.search || '')) {
        navigate({
          to: '/blogs/list',
          search: (prev) => ({ ...prev, search: searchTerm || undefined }),
        })
      }
    }, 500)
    return () => clearTimeout(timer)
  }, [searchTerm, search.search, navigate])

  const handleStatusChange = (value: string) => {
    navigate({
      to: '/blogs/list',
      search: (prev) => ({
        ...prev,
        status: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleCategoryChange = (value: string) => {
    navigate({
      to: '/blogs/list',
      search: (prev) => ({
        ...prev,
        categoryId: value === 'all' ? undefined : value,
      }),
    })
  }

  const handleSortChange = (value: string) => {
    const [sortBy, sortOrder] = value.split('.')
    navigate({
      to: '/blogs/list',
      search: (prev) => ({
        ...prev,
        sortBy: sortBy,
        sortOrder: sortOrder as 'asc' | 'desc',
      }),
    })
  }

  const clearFilters = () => {
    setSearchTerm('')
    navigate({
      to: '/blogs/list',
      search: {},
    })
  }

  const hasFilters =
    search.search || search.status || search.categoryId || search.sortBy

  return (
    <div className='flex flex-col gap-4 md:flex-row md:items-center md:justify-between'>
      <div className='flex flex-1 flex-col gap-2 overflow-x-auto p-1 sm:flex-row sm:items-center'>
        <Input
          placeholder='Search blogs...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='h-8 w-full sm:w-[200px] lg:w-[300px]'
        />

        <Select
          value={search.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className='h-8 w-full sm:w-[130px]'>
            <SelectValue placeholder='Status' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Statuses</SelectItem>
            {statuses.map((status) => (
              <SelectItem key={status.value} value={status.value}>
                {status.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={search.categoryId || 'all'}
          onValueChange={handleCategoryChange}
        >
          <SelectTrigger className='h-8 w-full sm:w-[150px]'>
            <SelectValue placeholder='Category' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>All Categories</SelectItem>
            {categories.map((cat: any) => (
              <SelectItem key={cat.id} value={cat.id}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={
            search.sortBy
              ? `${search.sortBy}.${search.sortOrder || 'asc'}`
              : 'createdAt.desc'
          }
          onValueChange={handleSortChange}
        >
          <SelectTrigger className='h-8 w-full sm:w-[150px]'>
            <SelectValue placeholder='Sort by' />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasFilters && (
          <Button
            variant='ghost'
            onClick={clearFilters}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
