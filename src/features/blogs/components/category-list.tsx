import { format } from 'date-fns'
import { Link } from '@tanstack/react-router'
import { Edit, FileText, MoreVertical, Trash } from 'lucide-react'
import { BlogCategory } from '@/api/services/blog.service'
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

interface CategoryListProps {
  data: BlogCategory[]
  isLoading: boolean
  onEdit: (category: BlogCategory) => void
  onDelete: (category: BlogCategory) => void
}

export function CategoryList({
  data,
  isLoading,
  onEdit,
  onDelete,
}: CategoryListProps) {
  if (isLoading) {
    return (
      <div className='rounded-md border'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className='w-[70px]'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 5 }).map((_, i) => (
              <TableRow key={i}>
                <TableCell>
                  <Skeleton className='h-4 w-[150px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[200px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-4 w-[100px]' />
                </TableCell>
                <TableCell>
                  <Skeleton className='h-8 w-8 rounded-full' />
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
        <h3 className='mt-4 text-lg font-semibold'>No categories found</h3>
        <p className='text-muted-foreground mt-2 mb-4 text-sm'>
          Get started by creating a new category.
        </p>
      </div>
    )
  }

  return (
    <div className='rounded-md border'>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Slug</TableHead>
            <TableHead className='hidden md:table-cell'>Description</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead className='w-[70px]'></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((category) => (
            <TableRow key={category.id}>
              <TableCell className='font-medium'>{category.name}</TableCell>
              <TableCell className='font-mono text-xs'>
                {category.slug}
              </TableCell>
              <TableCell className='hidden max-w-[300px] truncate md:table-cell'>
                {category.description || '-'}
              </TableCell>
              <TableCell>
                {format(new Date(category.createdAt), 'MMM d, yyyy')}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' className='h-8 w-8 p-0'>
                      <span className='sr-only'>Open menu</span>
                      <MoreVertical className='h-4 w-4' />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align='end'>
                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                    <DropdownMenuItem asChild>
                      <Link
                        to='/blogs/list'
                        search={{ categoryId: category.id }}
                      >
                        <FileText className='mr-2 h-4 w-4' />
                        View Blogs
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => onEdit(category)}>
                      <Edit className='mr-2 h-4 w-4' />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(category)}
                      className='text-destructive focus:text-destructive'
                    >
                      <Trash className='mr-2 h-4 w-4' />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}
