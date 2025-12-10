import { format } from 'date-fns'
import { useNavigate, Link } from '@tanstack/react-router'
import { Edit, Eye, MoreVertical, Trash } from 'lucide-react'
import { type Blog } from '@/api/services/blog.service'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from '@/components/ui/context-menu'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface BlogListProps {
  data: Blog[]
  isLoading: boolean
  onDelete: (blog: Blog) => void
}

export function BlogList({ data, isLoading, onDelete }: BlogListProps) {
  const navigate = useNavigate()

  if (isLoading) {
    return (
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[400px]'>Blog Details</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='sticky right-0 w-[50px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className='flex items-center gap-3'>
                    <Skeleton className='h-16 w-24 rounded-md' />
                    <div className='flex flex-col gap-2'>
                      <Skeleton className='h-4 w-48' />
                      <Skeleton className='h-3 w-32' />
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-5 w-16' />
                </TableCell>
                <TableCell>
                  <div className='flex items-center gap-2'>
                    <Skeleton className='h-4 w-24' />
                  </div>
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-24' />
                </TableCell>
                <TableCell className='sticky right-0'>
                  <Skeleton className='h-8 w-8' />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[400px]'>Blog Details</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Author</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className='bg-background sticky right-0 w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((blog) => (
            <ContextMenu key={blog.id}>
              <ContextMenuTrigger asChild>
                <TableRow>
                  <TableCell className='max-w-[300px]'>
                    <div className='flex items-start gap-3'>
                      <Link
                        to='/blogs/$blogId'
                        params={{ blogId: blog.id }}
                        className='shrink-0'
                      >
                        {blog.thumbnailUrl ? (
                          <img
                            src={blog.thumbnailUrl}
                            alt={blog.title}
                            className='h-16 w-24 rounded-md object-cover'
                          />
                        ) : (
                          <div className='bg-muted flex h-16 w-24 items-center justify-center rounded-md border text-xs text-gray-400'>
                            No img
                          </div>
                        )}
                      </Link>
                      <div className='flex flex-col gap-1 overflow-hidden'>
                        <Link
                          to='/blogs/$blogId'
                          params={{ blogId: blog.id }}
                          className='decoration-primary block truncate font-medium'
                          title={blog.title}
                        >
                          {blog.title}
                        </Link>
                        <span className='text-muted-foreground truncate text-xs'>
                          {blog.category?.name || 'Uncategorized'}
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        blog.status === 'PUBLISHED'
                          ? 'default'
                          : blog.status === 'ARCHIVED'
                            ? 'destructive'
                            : 'secondary'
                      }
                    >
                      {blog.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <span className='text-sm font-medium'>
                      {blog.authorName || 'Admin'}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className='text-sm text-nowrap'>
                      {format(new Date(blog.createdAt), 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell className='bg-background sticky right-0 shadow-[0_0_10px_rgba(0,0,0,0.05)]'>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant='ghost'
                          size='sm'
                          className='data-[state=open]:bg-muted h-8 w-8 p-0'
                        >
                          <MoreVertical className='h-4 w-4' />
                          <span className='sr-only'>Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align='end'>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/blogs/$blogId',
                              params: { blogId: blog.id },
                            })
                          }
                        >
                          <Eye className='mr-2 h-4 w-4' />
                          View Details
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            navigate({
                              to: '/blogs/$blogId/edit',
                              params: { blogId: blog.id },
                            })
                          }
                        >
                          <Edit className='mr-2 h-4 w-4' />
                          Edit Post
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
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent>
                <ContextMenuItem
                  onClick={() =>
                    navigate({
                      to: '/blogs/$blogId',
                      params: { blogId: blog.id },
                    })
                  }
                >
                  <Eye className='mr-2 h-4 w-4' />
                  View Details
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() =>
                    navigate({
                      to: '/blogs/$blogId/edit',
                      params: { blogId: blog.id },
                    })
                  }
                >
                  <Edit className='mr-2 h-4 w-4' />
                  Edit Post
                </ContextMenuItem>
                <ContextMenuItem
                  onClick={() => onDelete(blog)}
                  className='text-destructive focus:text-destructive'
                >
                  <Trash className='mr-2 h-4 w-4' />
                  Delete Post
                </ContextMenuItem>
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
