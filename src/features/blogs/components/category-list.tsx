import { format } from 'date-fns'
import { useNavigate } from '@tanstack/react-router'
import { type ColumnDef } from '@tanstack/react-table'
import { Edit, FileText, MoreHorizontal, Trash } from 'lucide-react'
import { type BlogCategory } from '@/api/services/blog.service'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTable } from '@/components/data-table/data-table'

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
  const navigate = useNavigate()

  const columns: ColumnDef<BlogCategory>[] = [
    {
      id: 'select',
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label='Select all'
          className='translate-y-[2px]'
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label='Select row'
          className='translate-y-[2px]'
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: 'Name',
      cell: ({ row }) => (
        <span className='font-medium'>{row.original.name}</span>
      ),
    },
    {
      accessorKey: 'slug',
      header: 'Slug',
      cell: ({ row }) => (
        <span className='font-mono text-xs'>{row.original.slug}</span>
      ),
    },
    {
      accessorKey: 'description',
      header: 'Description',
      cell: ({ row }) => (
        <span className='text-muted-foreground line-clamp-1 max-w-[300px]'>
          {row.original.description || '-'}
        </span>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Created At',
      cell: ({ row }) =>
        format(new Date(row.original.createdAt), 'MMM d, yyyy'),
    },
    {
      id: 'actions',
      cell: ({ row }) => {
        const category = row.original
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' className='h-8 w-8 p-0'>
                <span className='sr-only'>Open menu</span>
                <MoreHorizontal className='h-4 w-4' />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() =>
                  navigate({
                    to: '/blogs/list',
                    search: { categoryId: category.id },
                  })
                }
              >
                <FileText className='mr-2 h-4 w-4' />
                View Blogs
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
        )
      },
      size: 50,
      enableSorting: false,
    },
  ]

  const getRowActions = (row: { original: BlogCategory }) => [
    {
      label: 'View Blogs',
      icon: FileText,
      onClick: () =>
        navigate({
          to: '/blogs/list',
          search: { categoryId: row.original.id },
        }),
    },
    {
      label: 'Edit',
      icon: Edit,
      onClick: () => onEdit(row.original),
    },
    {
      label: 'Delete',
      icon: Trash,
      onClick: () => onDelete(row.original),
      variant: 'destructive',
    },
  ]

  return (
    <DataTable
      data={data}
      columns={columns}
      isLoading={isLoading}
      search={{}}
      navigate={navigate}
      entityName='category'
      searchPlaceholder='Search categories...'
      hideToolbar={true}
      // @ts-expect-error - getRowActions is not strictly typed in DataTableProps yet
      getRowActions={getRowActions}
    />
  )
}
