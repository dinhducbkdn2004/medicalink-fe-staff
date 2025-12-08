import { useState } from 'react'
import { useNavigate, getRouteApi } from '@tanstack/react-router'
import { Plus } from 'lucide-react'
import { type Blog } from '@/api/services/blog.service'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BlogFilters } from '../components/blog-filters'
import { BlogList } from '../components/blog-list'
import { useBlogs, useDeleteBlog } from '../data/use-blogs'

const route = getRouteApi('/_authenticated/blogs/list')

export function BlogsPage() {
  const navigate = useNavigate()
  const search = route.useSearch()

  // @ts-ignore
  const { data, isLoading } = useBlogs(search)
  const { mutate: deleteBlog } = useDeleteBlog()

  const [deletingBlog, setDeletingBlog] = useState<Blog | null>(null)

  const handleDelete = () => {
    if (deletingBlog) {
      deleteBlog(deletingBlog.id, {
        onSuccess: () => setDeletingBlog(null),
      })
    }
  }

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

      <Main className='bg-muted/20 flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-col gap-4'>
          <div className='flex flex-wrap items-end justify-between gap-2'>
            <div>
              <h2 className='text-3xl font-bold tracking-tight'>
                Blog Management
              </h2>
              <p className='text-muted-foreground'>
                Create, manage, and publish your content.
              </p>
            </div>
            <Button onClick={() => navigate({ to: '/blogs/new' })}>
              <Plus className='mr-2 h-4 w-4' /> Create New Post
            </Button>
          </div>

          <BlogFilters />
        </div>

        <BlogList
          //@ts-ignore
          data={Array.isArray(data) ? data : data?.data || []}
          isLoading={isLoading}
          onDelete={setDeletingBlog}
        />
      </Main>

      <AlertDialog
        open={!!deletingBlog}
        onOpenChange={(open) => !open && setDeletingBlog(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the
              blog post &quot;{deletingBlog?.title}&quot;.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
              onClick={handleDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
