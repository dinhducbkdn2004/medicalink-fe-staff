import { useEffect, useState } from 'react'
import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { X } from 'lucide-react'
import type { BlogCategory } from '@/api/services/blog.service'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { useBlogCategories } from '../data/use-blog-categories'


const statuses = [
  { label: 'Bản nháp', value: 'DRAFT' },
  { label: 'Đã xuất bản', value: 'PUBLISHED' },
  { label: 'Đã lưu trữ', value: 'ARCHIVED' },
]


const sortOptions = [
  { label: 'Mới nhất', value: 'createdAt.desc' },
  { label: 'Cũ nhất', value: 'createdAt.asc' },
  { label: 'Xem nhiều nhất', value: 'viewCount.desc' },
  { label: 'Tên A-Z', value: 'title.asc' },
  { label: 'Tên Z-A', value: 'title.desc' },
]

const route = getRouteApi('/_authenticated/blogs/list')

export function BlogFilters() {
  const navigate = useNavigate()
  const search = route.useSearch()

  
  const { data: categoriesData } = useBlogCategories({ limit: 100 })
  const categories = Array.isArray(categoriesData)
    ? (categoriesData as BlogCategory[])
    : (categoriesData as { data: BlogCategory[] })?.data || []

  const [searchTerm, setSearchTerm] = useState(search.search || '')

  
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
          placeholder='Tìm kiếm bài viết...'
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className='h-8 w-full sm:w-[200px] lg:w-[250px]'
        />

        <Select
          value={search.status || 'all'}
          onValueChange={handleStatusChange}
        >
          <SelectTrigger className='h-8 w-full sm:w-[130px]'>
            <SelectValue placeholder='Trạng thái' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả trạng thái</SelectItem>
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
          <SelectTrigger className='h-8 w-full sm:w-[140px]'>
            <SelectValue placeholder='Danh mục' />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='all'>Tất cả danh mục</SelectItem>
            {categories.map((cat) => (
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
          <SelectTrigger className='h-8 w-full sm:w-[100px]'>
            <SelectValue placeholder='Sắp xếp theo' />
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
            Đặt lại
            <X className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
    </div>
  )
}
