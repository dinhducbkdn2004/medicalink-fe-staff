
import type { Row } from '@tanstack/react-table'
import { MoreHorizontal, Edit, Trash2, Info } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { type Specialty } from '../data/schema'
import { useSpecialties } from './specialties-provider'

interface DataTableRowActionsProps {
  row: Row<Specialty>
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const { setOpen, setCurrentRow } = useSpecialties()
  const specialty = row.original

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex size-8 p-0'
        >
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>Mở menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(specialty)
            setOpen('view-info')
          }}
        >
          <Info className='mr-2 size-4' />
          Các phần thông tin
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(specialty)
            setOpen('edit')
          }}
        >
          <Edit className='mr-2 size-4' />
          Chỉnh sửa
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentRow(specialty)
            setOpen('delete')
          }}
          className='text-destructive focus:text-destructive'
        >
          <Trash2 className='mr-2 size-4' />
          Xóa
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
