import { format } from 'date-fns'
import type { ColumnDef } from '@tanstack/react-table'
import type { Testimonial } from '@/api/services/testimonial.service'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

export const testimonialsColumns: ColumnDef<Testimonial>[] = [
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
    accessorKey: 'authorName',
    header: 'Người gửi',
    cell: ({ row }) => {
      const t = row.original
      return (
        <div className='flex items-center gap-2 max-w-[240px]'>
          {t.authorAvatar ? (
            <img
              src={t.authorAvatar}
              alt=''
              className='size-8 rounded-full object-cover'
            />
          ) : null}
          <div className='min-w-0'>
            <div className='font-medium truncate'>{t.authorName}</div>
            {t.authorTitle ? (
              <div className='text-xs text-muted-foreground truncate'>
                {t.authorTitle}
              </div>
            ) : null}
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: 'content',
    header: 'Nội dung',
    cell: ({ row }) => (
      <span className='line-clamp-2 max-w-[360px] text-muted-foreground'>
        {row.original.content}
      </span>
    ),
  },
  {
    accessorKey: 'rating',
    header: 'Đánh giá',
    cell: ({ row }) => row.original.rating ?? '—',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Nổi bật',
    cell: ({ row }) =>
      row.original.isFeatured ? (
        <Badge>Có</Badge>
      ) : (
        <Badge variant='outline'>Không</Badge>
      ),
  },
  {
    accessorKey: 'updatedAt',
    header: 'Cập nhật',
    cell: ({ row }) =>
      format(new Date(row.original.updatedAt), 'dd/MM/yyyy HH:mm'),
  },
]
