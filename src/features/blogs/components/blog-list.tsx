import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { Edit, Eye, MoreVertical, Trash } from 'lucide-react'
import { type Blog } from '@/api/services/blog.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'

interface BlogListProps {
  data: Blog[]
  isLoading: boolean
  onDelete: (blog: Blog) => void
}

export function BlogList({ data, isLoading, onDelete }: BlogListProps) {
  const getExcerpt = (html: string) => {
    if (!html) return ''
    return html.replace(/<[^>]+>/g, '').slice(0, 150) + '...'
  }

  const getReadTime = (html: string) => {
    if (!html) return 0
    const text = html.replace(/<[^>]+>/g, '')
    const wordsPerMinute = 200
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  if (isLoading) {
    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className='bg-card text-card-foreground overflow-hidden rounded-lg border shadow-sm'
          >
            <Skeleton className='h-48 w-full' />
            <div className='grid gap-2 p-4'>
              <Skeleton className='h-6 w-3/4' />
              <Skeleton className='h-4 w-full' />
              <Skeleton className='h-4 w-2/3' />
              <div className='flex items-center gap-2 pt-2'>
                <Skeleton className='h-6 w-6 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className='animate-in fade-in-50 flex h-64 flex-col items-center justify-center rounded-lg border border-dashed text-center'>
        <div className='bg-muted mx-auto flex h-12 w-12 items-center justify-center rounded-full'>
          <Edit className='text-muted-foreground h-6 w-6' />
        </div>
        <h3 className='mt-4 text-lg font-semibold'>No blogs found</h3>
        <p className='text-muted-foreground mt-2 mb-4 text-sm'>
          Try adjusting your filters or create a new blog post.
        </p>
      </div>
    )
  }

  return (
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
      {data.map((blog) => (
        <div
          key={blog.id}
          className='bg-card text-card-foreground group flex flex-col overflow-hidden rounded-lg border shadow-sm transition-all hover:shadow-md'
        >
          {/* Image & Status Badge */}
          <div className='relative overflow-hidden'>
            <Link
              to={`/blogs/${blog.id}`}
              className='block aspect-video w-full'
            >
              {blog.thumbnailUrl ? (
                <img
                  src={blog.thumbnailUrl}
                  alt={blog.title}
                  width='400'
                  height='225'
                  className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-105'
                />
              ) : (
                <div className='bg-muted flex h-full w-full items-center justify-center text-gray-400'>
                  <span className='text-4xl font-bold opacity-20'>Blog</span>
                </div>
              )}
            </Link>
            <div className='absolute top-2 right-2'>
              <Badge
                variant={
                  blog.status === 'PUBLISHED'
                    ? 'default'
                    : blog.status === 'ARCHIVED'
                      ? 'destructive'
                      : 'secondary'
                }
                className='shadow-sm'
              >
                {blog.status}
              </Badge>
            </div>
          </div>

          <div className='flex flex-1 flex-col p-4'>
            <div className='grid gap-2'>
              <Link to={`/blogs/${blog.id}`}>
                <h3 className='decoration-primary line-clamp-2 text-lg leading-tight font-semibold decoration-2 '>
                  {blog.title}
                </h3>
              </Link>
              <p className='text-muted-foreground line-clamp-3 text-sm'>
                {getExcerpt(blog.content)}
              </p>
            </div>

            <div className='mt-auto'>
              <div className='text-muted-foreground flex items-center justify-between text-sm'>
                <div className='flex items-center gap-2'>
                  <span
                    data-slot='avatar'
                    className='relative flex h-6 w-6 shrink-0 overflow-hidden rounded-full'
                  >
                    <Avatar className='h-6 w-6'>
                      <AvatarImage
                        src={`https://ui-avatars.com/api/?name=${blog.authorName || 'Admin'}`}
                      />
                      <AvatarFallback>
                        {(blog.authorName || 'AD').substring(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                  </span>
                  <span className='max-w-[100px] truncate'>
                    {blog.authorName || 'Admin'}
                  </span>
                  <span>•</span>
                  <span>{getReadTime(blog.content)} min read</span>
                </div>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant='ghost'
                      size='sm'
                      className='text-muted-foreground hover:text-foreground h-8 w-8 p-0'
                    >
                      <span className='sr-only'>Open menu</span>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuItem asChild>
                      <Link to={`/blogs/${blog.id}`}>
                        <Eye className='mr-2 h-4 w-4' />
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to={`/blogs/${blog.id}/edit`}>
                        <Edit className='mr-2 h-4 w-4' />
                        Edit Post
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(blog)}
                      className='text-destructive focus:text-destructive'
                    >
                      <Trash className='mr-2 h-4 w-4' />
                      Delete Post
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
