import { useState } from 'react'
import { Plus } from 'lucide-react'
import { getRouteApi } from '@tanstack/react-router'
import { type BlogCategory } from '@/api/services/blog.service'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { CategoryDeleteDialog } from './components/category-delete-dialog'
import { CategoryFormDialog } from './components/category-form-dialog'
import { CategoryList } from './components/category-list'
import { useBlogCategories } from './data/use-blog-categories'

const blogCategoriesRoute = getRouteApi('/_authenticated/blogs/categories')

export function BlogCategories() {
  const search = blogCategoriesRoute.useSearch()
  const navigate = blogCategoriesRoute.useNavigate()

  const { data, isLoading } = useBlogCategories({
    page: (search.page as number) || 1,
    limit: (search.pageSize as number) || 10,
    search: (search.search as string)?.trim() || undefined,
    sortBy: (search.sortBy as string) || undefined,
    sortOrder: (search.sortOrder as 'asc' | 'desc') || undefined,
  })
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState<BlogCategory | null>(
    null
  )
  const [deletingCategory, setDeletingCategory] = useState<BlogCategory | null>(
    null
  )

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Blog Categories
            </h2>
            <p className='text-muted-foreground'>
              Manage categories for your blog posts.
            </p>
          </div>
          <Button onClick={() => setIsCreateOpen(true)}>
            <Plus className='mr-2 h-4 w-4' /> Create Category
          </Button>
        </div>

        <CategoryList
          data={
            Array.isArray(data)
              ? data
              : ((data as { data?: BlogCategory[] })?.data ?? [])
          }
          pageCount={Math.max(
            1,
            (data as { meta?: { totalPages?: number } } | undefined)?.meta
              ?.totalPages ?? 1
          )}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
          onEdit={(category) => setEditingCategory(category)}
          onDelete={(category) => setDeletingCategory(category)}
        />
      </Main>

      <CategoryFormDialog
        open={isCreateOpen || !!editingCategory}
        onOpenChange={(open) => {
          if (!open) {
            setIsCreateOpen(false)
            setEditingCategory(null)
          }
        }}
        category={editingCategory}
      />

      <CategoryDeleteDialog
        open={!!deletingCategory}
        onOpenChange={(open) => {
          if (!open) setDeletingCategory(null)
        }}
        category={deletingCategory}
      />
    </>
  )
}
