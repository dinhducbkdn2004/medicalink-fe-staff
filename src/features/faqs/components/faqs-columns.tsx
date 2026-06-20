import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { Faq } from '@/api/services/faq.service'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const faqsColumns: ColumnDef<Faq>[] = [
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
    accessorKey: 'question',
    header: 'Câu hỏi',
    cell: ({ row }) => (
      <span className='font-medium line-clamp-2 max-w-[320px]'>
        {row.original.question}
      </span>
    ),
  },
  {
    accessorKey: 'order',
    header: 'Thứ tự',
    cell: ({ row }) => row.original.order,
  },
  {
    accessorKey: 'isActive',
    header: 'Hiển thị',
    cell: ({ row }) =>
      row.original.isActive ? (
        <Badge variant='default'>Bật</Badge>
      ) : (
        <Badge variant='secondary'>Tắt</Badge>
      ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Cập nhật',
    cell: ({ row }) =>
      format(new Date(row.original.updatedAt), 'dd/MM/yyyy HH:mm'),
  },
]
