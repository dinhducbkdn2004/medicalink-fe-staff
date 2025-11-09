/**
 * Questions Data Table Row Actions
 * Dropdown menu actions for individual question rows
 */
import { MoreHorizontal } from 'lucide-react'
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
import { useQuestions } from './questions-provider'
import { Edit, Trash2, Eye, CheckCircle, XCircle } from 'lucide-react'

interface DataTableRowActionsProps {
  row: { original: Question }
}

export function DataTableRowActions({ row }: DataTableRowActionsProps) {
  const question = row.original
  const { setOpen, setCurrentQuestion } = useQuestions()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='ghost'
          className='flex size-8 p-0 data-[state=open]:bg-muted'
        >
          <MoreHorizontal className='size-4' />
          <span className='sr-only'>Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-[160px]'>
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
            setOpen('approve')
          }}
          disabled={
            question.status === 'APPROVED' || question.status === 'ANSWERED'
          }
        >
          <CheckCircle className='mr-2 size-4' />
          Approve
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentQuestion(question)
            setOpen('reject')
          }}
        >
          <XCircle className='mr-2 size-4' />
          Reject
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
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

