import { DotsHorizontalIcon } from '@radix-ui/react-icons'
import { Link } from '@tanstack/react-router'
import { type Row } from '@tanstack/react-table'
import { Settings2 } from 'lucide-react'
import { type Staff } from '@/features/staffs/data/schema'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

type RbacUserRowActionsProps = {
  row: Row<Staff>
  manageTo: '/user-permission/$userId' | '/user-group/$userId'
  manageLabel: string
}

export function RbacUserRowActions({
  row,
  manageTo,
  manageLabel,
}: RbacUserRowActionsProps) {
  const staff = row.original

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex h-8 w-8 p-0'
        >
          <DotsHorizontalIcon className='h-4 w-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[200px]'>
        <DropdownMenuItem asChild>
          <Link
            to={manageTo}
            params={{ userId: staff.id }}
            className='cursor-pointer'
          >
            {manageLabel}
            <DropdownMenuShortcut>
              <Settings2 size={16} />
            </DropdownMenuShortcut>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
