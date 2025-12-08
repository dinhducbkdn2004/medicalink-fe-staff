import { useState } from 'react'
import { Plus } from 'lucide-react'
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

export function BlogCategories() {
  const { data, isLoading } = useBlogCategories()
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
          //@ts-ignore - Handle both array and paginated response
          data={Array.isArray(data) ? data : data?.data || []}
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
          } else {
            // If we are opening via state change, ensure we don't accidentally close
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
