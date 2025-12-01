/**
 * Question View Dialog
 * Dialog for viewing question details
 */
import { format } from 'date-fns'
import { X, MessageCircle, Eye, CheckCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { useQuestions } from './use-questions'

// ============================================================================
// Component
// ============================================================================

export function QuestionViewDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const isOpen = open.view

  if (!currentQuestion) return null

  const statusConfig: Record<string, { label: string; className: string }> = {
    PENDING: {
      label: 'Pending',
      className:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400',
    },
    APPROVED: {
      label: 'Approved',
      className:
        'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400',
    },
    ANSWERED: {
      label: 'Answered',
      className:
        'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400',
    },
    REJECTED: {
      label: 'Rejected',
      className: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400',
    },
  }

  const config = statusConfig[currentQuestion.status]

  return (
    <Drawer
      direction='right'
      open={isOpen}
      onOpenChange={() => setOpen('view')}
    >
      <DrawerContent className='h-full w-full sm:w-[600px]'>
        <DrawerHeader>
          <div className='flex items-start justify-between gap-4'>
            <DrawerTitle className='text-xl leading-tight'>
              {currentQuestion.title}
            </DrawerTitle>
            {config && (
              <Badge
                variant='default'
                className={cn(config.className, 'shrink-0')}
              >
                {config.label}
              </Badge>
            )}
          </div>
          <DrawerDescription className='sr-only'>
            View detailed information about this question including author,
            specialty, answers, and statistics
          </DrawerDescription>
        </DrawerHeader>

        <div className='flex flex-1 flex-col overflow-y-auto p-4'>
          <div className='space-y-6'>
            {/* Author & Specialty */}
            <div className='flex flex-wrap gap-4 text-sm'>
              {currentQuestion.authorName && (
                <div className='text-muted-foreground flex items-center gap-2'>
                  <span className='font-medium'>Asked by:</span>
                  <span>{currentQuestion.authorName}</span>
                </div>
              )}
              {currentQuestion.specialty && (
                <div className='flex items-center gap-2'>
                  <Badge variant='outline' className='font-normal'>
                    {currentQuestion.specialty.name}
                  </Badge>
                </div>
              )}
            </div>

            <Separator />

            {/* Question Body */}
            <div>
              <h3 className='text-muted-foreground mb-3 text-sm font-medium'>
                Question Details
              </h3>
              <div className='bg-muted rounded-lg p-4'>
                <p className='leading-relaxed whitespace-pre-wrap'>
                  {currentQuestion.body}
                </p>
              </div>
            </div>

            <Separator />

            {/* Statistics */}
            <div className='grid grid-cols-3 gap-4'>
              <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
                <MessageCircle className='text-muted-foreground size-5' />
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {currentQuestion.answerCount}
                  </div>
                  <div className='text-muted-foreground text-xs'>Answers</div>
                </div>
              </div>
              <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
                <CheckCircle className='size-5 text-green-600' />
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {currentQuestion.acceptedAnswerCount || 0}
                  </div>
                  <div className='text-muted-foreground text-xs'>Accepted</div>
                </div>
              </div>
              <div className='flex flex-col items-center gap-2 rounded-lg border p-4'>
                <Eye className='text-muted-foreground size-5' />
                <div className='text-center'>
                  <div className='text-2xl font-bold'>
                    {currentQuestion.viewCount}
                  </div>
                  <div className='text-muted-foreground text-xs'>Views</div>
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className='text-muted-foreground flex justify-between text-sm'>
              <div>
                Asked on{' '}
                {format(new Date(currentQuestion.createdAt), 'MMMM dd, yyyy')}
              </div>
              {currentQuestion.updatedAt !== currentQuestion.createdAt && (
                <div>
                  Updated{' '}
                  {format(new Date(currentQuestion.updatedAt), 'MMMM dd, yyyy')}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className='flex justify-end gap-2 p-4 pt-0'>
          <Button variant='outline' onClick={() => setOpen('view')}>
            <X className='mr-2 size-4' />
            Close
          </Button>
          <Button
            onClick={() => {
              setOpen('view') // Close current
              setOpen('answers') // Open answers
            }}
          >
            <MessageCircle className='mr-2 size-4' />
            Manage Answers
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
