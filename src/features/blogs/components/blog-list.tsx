import { format } from 'date-fns'
import { useNavigate, Link } from '@tanstack/react-router'
import { Edit, Eye, MoreVertical, Trash } from 'lucide-react'
import { type Blog, type BlogStatus } from '@/api/services/blog.service'
import { useAuthStore } from '@/stores/auth-store'
import { cn } from '@/lib/utils'
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useUpdateBlog } from '../data/use-blogs'

interface BlogListProps {
  data: Blog[]
  isLoading: boolean
  onDelete: (blog: Blog) => void
}

export function BlogList({ data, isLoading, onDelete }: BlogListProps) {
  const navigate = useNavigate()
  const { user } = useAuthStore()
  const { mutate: updateBlog } = useUpdateBlog()
  const isDoctor = user?.role === 'DOCTOR'

  const handleStatusChange = (blogId: string, status: string) => {
    updateBlog({ id: blogId, data: { status: status as BlogStatus } })
  }

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
            <TableHead className='sticky right-0 w-[50px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((blog) => (
            <ContextMenu key={blog.id}>
              <ContextMenuTrigger asChild>
                <TableRow>
                  <TableCell className='max-w-[300px]'>
                    <div className='flex items-start gap-3'>
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
                    <Select
                      key={`${blog.id}-${blog.status}`}
                      value={blog.status}
                      onValueChange={(value) =>
                        handleStatusChange(blog.id, value)
                      }
                      disabled={isDoctor && blog.authorId !== user?.id}
                    >
                      <SelectTrigger
                        className={cn(
                          'w-[120px] text-xs font-medium',
                          blog.status === 'PUBLISHED' &&
                            'bg-green-100 text-green-800 hover:bg-green-100/80 dark:bg-green-900/30 dark:text-green-400',
                          blog.status === 'ARCHIVED' &&
                            'bg-red-100 text-red-800 hover:bg-red-100/80 dark:bg-red-900/30 dark:text-red-400',
                          blog.status === 'DRAFT' &&
                            'bg-gray-100 text-gray-800 hover:bg-gray-100/80 dark:bg-gray-800 dark:text-gray-300'
                        )}
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='DRAFT'>DRAFT</SelectItem>
                        <SelectItem value='PUBLISHED'>PUBLISHED</SelectItem>
                        <SelectItem value='ARCHIVED'>ARCHIVED</SelectItem>
                      </SelectContent>
                    </Select>
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
                  <TableCell className='sticky right-0 shadow-[0_0_10px_rgba(0,0,0,0.05)]'>
                    {isDoctor && blog.authorId !== user?.id ? null : (
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
                    )}
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
                {(!isDoctor || blog.authorId === user?.id) && (
                  <>
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
                  </>
                )}
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
