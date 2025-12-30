import { format } from 'date-fns'
import { useParams } from '@tanstack/react-router'
import { Eye } from 'lucide-react'
import { type Blog } from '@/api/services/blog.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { PageLoader } from '@/components/ui/page-loader'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { useBlog } from '../data/use-blogs'

export function BlogViewPage() {
  const { blogId } = useParams({ strict: false })
  const { data: blogResponse, isLoading } = useBlog(blogId as string)

  const blog =
    blogResponse && 'data' in blogResponse
      ? (blogResponse as { data: Blog }).data
      : (blogResponse as Blog | undefined)

  if (isLoading) {
    return <PageLoader />
  }

  if (!blog) {
    return <Main>Blog not found</Main>
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

      <Main>
        <div className='mx-auto max-w-4xl space-y-8 pb-12'>
          {}
          <div className='space-y-4'>
            <div className='text-muted-foreground flex items-center gap-2 text-sm'>
              <span className='bg-muted rounded-md px-2 py-1 text-xs font-medium'>
                {blog.category?.name || 'Uncategorized'}
              </span>
              <span>•</span>
              <span>{format(new Date(blog.createdAt), 'MMMM d, yyyy')}</span>
            </div>

            <h1 className='text-2xl font-bold tracking-tight lg:text-3xl'>
              {blog.title}
            </h1>

            <div className='flex items-center justify-between border-t pt-4'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-8 w-8'>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${blog.authorName || 'Admin'}`}
                  />
                  <AvatarFallback>
                    {(blog.authorName || 'AD').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className='text-sm leading-none font-medium'>
                    {blog.authorName || 'Super Admin'}
                  </p>
                  <p className='text-muted-foreground text-xs'>Author</p>
                </div>
              </div>
              <div className='text-muted-foreground flex items-center gap-1 text-sm'>
                <Eye className='h-4 w-4' />
                <span>{blog.viewCount} views</span>
              </div>
            </div>
          </div>

          {}
          {blog.thumbnailUrl && (
            <div className='bg-muted aspect-video w-full overflow-hidden rounded-lg border'>
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className='h-full w-full object-cover'
              />
            </div>
          )}

          {}
          <article
            className='prose prose-stone dark:prose-invert lg:prose-lg max-w-none [&_img]:mx-auto [&_img]:block'
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </div>
      </Main>
    </>
  )
}
