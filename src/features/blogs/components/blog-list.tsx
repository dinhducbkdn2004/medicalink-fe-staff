import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { Edit, Eye, MoreVertical, Trash } from 'lucide-react'
import { type Blog } from '@/api/services/blog.service'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
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
  if (isLoading) {
    return (
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i} className='overflow-hidden border-none shadow-md'>
            <Skeleton className='h-48 w-full' />
            <div className='space-y-3 p-4'>
              <div className='flex justify-between'>
                <Skeleton className='h-4 w-20' />
                <Skeleton className='h-4 w-12' />
              </div>
              <Skeleton className='h-6 w-full' />
              <div className='flex items-center gap-2 pt-2'>
                <Skeleton className='h-8 w-8 rounded-full' />
                <Skeleton className='h-4 w-24' />
              </div>
            </div>
          </Card>
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
    <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
      {data.map((blog) => (
        <Card
          key={blog.id}
          className='group relative flex flex-col overflow-hidden border-none shadow-md transition-all hover:-translate-y-1 hover:shadow-xl'
        >
          {/* Thumbnail & Status */}
          <div className='bg-muted relative aspect-video w-full overflow-hidden'>
            {blog.thumbnailUrl ? (
              <img
                src={blog.thumbnailUrl}
                alt={blog.title}
                className='h-full w-full object-cover transition-transform duration-500 group-hover:scale-110'
              />
            ) : (
              <div className='flex h-full w-full items-center justify-center bg-gray-100 text-gray-400'>
                <span className='text-4xl font-bold opacity-20'>Blog</span>
              </div>
            )}
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

            <div className='absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/60 to-transparent p-4'>
              {blog.category && (
                <Badge
                  variant='outline'
                  className='bg-background/80 text-foreground border-none backdrop-blur-sm'
                >
                  {blog.category.name}
                </Badge>
              )}
            </div>
          </div>

          <CardContent className='flex-1 p-4'>
            <Link to={`/blogs/${blog.id}`} className='cursor-pointer'>
              <CardTitle className='decoration-primary mb-2 line-clamp-2 min-h-[3.5rem] text-lg leading-tight font-bold hover:underline hover:decoration-2 hover:underline-offset-4'>
                {blog.title}
              </CardTitle>
            </Link>

            <div className='text-muted-foreground mt-4 flex items-center justify-between text-xs'>
              <div className='flex items-center gap-2'>
                <Avatar className='h-6 w-6'>
                  <AvatarImage
                    src={`https://ui-avatars.com/api/?name=${blog.authorName || 'Admin'}&background=random`}
                  />
                  <AvatarFallback>
                    {(blog.authorName || 'AD').substring(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <span className='max-w-[100px] truncate font-medium'>
                  {blog.authorName || 'Super Admin'}
                </span>
              </div>
              <div className='flex items-center gap-1'>
                <Eye className='h-3 w-3' />
                <span>{blog.viewCount}</span>
              </div>
            </div>
          </CardContent>

          <CardFooter className='bg-muted/30 flex items-center justify-between border-t px-4 py-3'>
            <div className='text-muted-foreground text-xs font-medium'>
              {format(new Date(blog.createdAt), 'MMM d, yyyy')}
            </div>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
                  <span className='sr-only'>Open menu</span>
                  <MoreVertical className='h-4 w-4' />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end'>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuSeparator />
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
          </CardFooter>
        </Card>
      ))}
    </div>
  )
}
