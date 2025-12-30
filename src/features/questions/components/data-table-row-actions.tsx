
import { MoreHorizontal, Edit, Trash2, Eye } from 'lucide-react'
import { useAuthStore } from '@/stores/auth-store'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import type { Question } from '../data/schema'
import { useQuestions } from './use-questions'

interface DataTableRowActionsProps {
  row: { original: Question }
}

export function DataTableRowActions({
  row,
}: Readonly<DataTableRowActionsProps>) {
  const question = row.original
  const { setOpen, setCurrentQuestion } = useQuestions()
  const { user } = useAuthStore()
  const isDoctor = user?.role === 'DOCTOR'

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='data-[state=open]:bg-muted flex size-8 p-0'
        >
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-40'>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuItem
          onClick={() => {
            setCurrentQuestion(question)
            setOpen('view')
          }}
        >
          <Eye className='mr-2 size-4' />
          View Details
        </DropdownMenuItem>
        {!isDoctor && (
          <>
            <DropdownMenuItem
              onClick={() => {
                setCurrentQuestion(question)
                setOpen('edit')
              }}
            >
              <Edit className='mr-2 size-4' />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setCurrentQuestion(question)
                setOpen('delete')
              }}
              className='text-destructive'
            >
              <Trash2 className='mr-2 size-4' />
              Delete
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
