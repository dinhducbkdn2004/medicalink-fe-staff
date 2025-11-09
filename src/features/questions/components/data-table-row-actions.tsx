/**
 * Questions Data Table Row Actions
 * Dropdown menu actions for individual question rows
 */
import {
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  XCircle,
} from 'lucide-react'
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
            setOpen('answer')
          }}
          disabled={
            question.status === 'ANSWERED' || question.status === 'CLOSED'
          }
        >
          <CheckCircle className='mr-2 size-4' />
          Mark as Answered
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            setCurrentQuestion(question)
            setOpen('close')
          }}
          disabled={question.status === 'CLOSED'}
        >
          <XCircle className='mr-2 size-4' />
          Close Question
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
