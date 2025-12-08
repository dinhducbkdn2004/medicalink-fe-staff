/**
 * Question Answers Dialog
 * Dialog for viewing and managing answers to a question
 */
import { useState } from 'react'
import { format } from 'date-fns'
import { CheckCircle, Trash2, X, ThumbsUp, User } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
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
import { Skeleton } from '@/components/ui/skeleton'
import type { Answer } from '../data/schema'
import {
  useAnswersForQuestion,
  useAcceptAnswer,
  useDeleteAnswer,
} from '../data/use-answers'
import { QuestionsAnswerForm } from './questions-answer-form'
import { useQuestions } from './use-questions'

// ============================================================================
// Component
// ============================================================================

export function QuestionAnswersDialog() {
  const { open, setOpen, currentQuestion } = useQuestions()
  const isOpen = open.answers

  const [editingAnswerId, setEditingAnswerId] = useState<string | null>(null)
  const [isCreating, setIsCreating] = useState(false)
  const [deleteAnswerId, setDeleteAnswerId] = useState<string | null>(null)

  // Fetch answers
  const { data: answersData, isLoading } = useAnswersForQuestion(
    currentQuestion?.id || '',
    { page: 1, limit: 50 }
  )

  const acceptAnswerMutation = useAcceptAnswer()
  const deleteAnswerMutation = useDeleteAnswer()

  if (!currentQuestion) return null

  const answers = answersData?.data || []

  const handleAcceptAnswer = async (answerId: string) => {
    try {
      await acceptAnswerMutation.mutateAsync(answerId)
    } catch (error) {
      console.error('Failed to accept answer:', error)
    }
  }

  const handleDeleteAnswer = async () => {
    if (!deleteAnswerId) return
    try {
      await deleteAnswerMutation.mutateAsync(deleteAnswerId)
      setDeleteAnswerId(null)
    } catch (error) {
      console.error('Failed to delete answer:', error)
    }
  }

  return (
    <>
      <Drawer
        direction='right'
        open={isOpen}
        onOpenChange={() => {
          setOpen('answers')
          setIsCreating(false)
          setEditingAnswerId(null)
        }}
      >
        <DrawerContent className='h-full w-full sm:w-[600px]'>
          <DrawerHeader>
            <DrawerTitle className='text-xl'>Manage Answers</DrawerTitle>
            <DrawerDescription className='line-clamp-2'>
              {currentQuestion.title}
            </DrawerDescription>
          </DrawerHeader>

          <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
            {/* Create Answer Section */}
            {!isCreating && !editingAnswerId ? (
              <Button
                onClick={() => setIsCreating(true)}
                className='w-full'
                variant='outline'
              >
                Write an Answer
              </Button>
            ) : isCreating ? (
              <div className='bg-muted/30 rounded-lg border p-4'>
                <h4 className='mb-3 font-semibold'>Write your answer</h4>
                <QuestionsAnswerForm
                  questionId={currentQuestion.id}
                  onSuccess={() => setIsCreating(false)}
                  onCancel={() => setIsCreating(false)}
                />
              </div>
            ) : null}

            <Separator />

            {isLoading ? (
              <div className='space-y-4'>
                {[1, 2, 3].map((i) => (
                  <div key={i} className='space-y-3 rounded-lg border p-4'>
                    <div className='flex items-center gap-3'>
                      <Skeleton className='size-10 rounded-full' />
                      <div className='space-y-2'>
                        <Skeleton className='h-4 w-32' />
                        <Skeleton className='h-3 w-24' />
                      </div>
                    </div>
                    <Skeleton className='h-20 w-full' />
                  </div>
                ))}
              </div>
            ) : (
              <>
                {answers.length === 0 ? (
                  <div className='flex flex-col items-center justify-center py-12 text-center'>
                    <div className='bg-muted text-muted-foreground mb-4 rounded-full p-4'>
                      <User className='size-8' />
                    </div>
                    <h3 className='mb-2 font-semibold'>No answers yet</h3>
                    <p className='text-muted-foreground text-sm'>
                      This question hasn't received any answers from doctors.
                    </p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {answers.map((answer: Answer) => (
                      <div
                        key={answer.id}
                        className='hover:bg-muted/50 rounded-lg border p-4 transition-colors'
                      >
                        {editingAnswerId === answer.id ? (
                          <QuestionsAnswerForm
                            questionId={currentQuestion.id}
                            answerToEdit={answer}
                            onSuccess={() => setEditingAnswerId(null)}
                            onCancel={() => setEditingAnswerId(null)}
                          />
                        ) : (
                          <>
                            {/* Doctor Info */}
                            <div className='mb-3 flex items-start justify-between'>
                              <div className='flex items-center gap-3'>
                                <Avatar className='size-10'>
                                  <AvatarImage
                                    src={answer.doctor?.avatarUrl || undefined}
                                    alt={
                                      answer.doctor?.fullName ||
                                      answer.authorName ||
                                      'Doctor'
                                    }
                                  />
                                  <AvatarFallback>
                                    {answer.doctor?.fullName ||
                                    answer.authorName
                                      ? (
                                          answer.doctor?.fullName ||
                                          answer.authorName ||
                                          'Doctor'
                                        )
                                          .split(' ')
                                          .map((n) => n[0])
                                          .join('')
                                          .toUpperCase()
                                          .slice(0, 2)
                                      : 'DR'}
                                  </AvatarFallback>
                                </Avatar>
                                <div>
                                  <div className='font-semibold'>
                                    {answer.doctor?.fullName ||
                                      answer.authorName ||
                                      'Unknown Doctor'}
                                  </div>
                                  {answer.doctor?.specialty && (
                                    <div className='text-muted-foreground text-xs'>
                                      {answer.doctor.specialty}
                                    </div>
                                  )}
                                </div>
                              </div>
                              {(answer.isAccepted ||
                                (
                                  answer as {
                                    is_accepted?: boolean
                                    accepted?: boolean
                                  }
                                ).is_accepted ||
                                (
                                  answer as {
                                    is_accepted?: boolean
                                    accepted?: boolean
                                  }
                                ).accepted) && (
                                <Badge className='bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'>
                                  <CheckCircle className='mr-1 size-3' />
                                  Accepted
                                </Badge>
                              )}
                            </div>

                            {/* Answer Body */}
                            <div className='bg-muted/50 mb-3 rounded-md p-3'>
                              <p className='text-sm leading-relaxed whitespace-pre-wrap'>
                                {answer.body}
                              </p>
                            </div>

                            {/* Meta & Actions */}
                            <div className='flex items-center justify-between'>
                              <div className='text-muted-foreground flex items-center gap-4 text-xs'>
                                <div className='flex items-center gap-1'>
                                  <ThumbsUp className='size-3' />
                                  <span>{answer.upvotes || 0} upvotes</span>
                                </div>
                                <div>
                                  {format(
                                    new Date(answer.createdAt),
                                    'MMM dd, yyyy'
                                  )}
                                </div>
                              </div>
                              <div className='flex items-center gap-2'>
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => {
                                    setEditingAnswerId(answer.id)
                                    setIsCreating(false)
                                  }}
                                  disabled={!!editingAnswerId || isCreating}
                                >
                                  Edit
                                </Button>
                                {!answer.isAccepted &&
                                  !(
                                    answer as {
                                      is_accepted?: boolean
                                      accepted?: boolean
                                    }
                                  ).is_accepted &&
                                  !(
                                    answer as {
                                      is_accepted?: boolean
                                      accepted?: boolean
                                    }
                                  ).accepted && (
                                    <Button
                                      size='sm'
                                      variant='outline'
                                      onClick={() =>
                                        handleAcceptAnswer(answer.id)
                                      }
                                      disabled={acceptAnswerMutation.isPending}
                                      className='border-green-600 text-green-600 hover:bg-green-50'
                                    >
                                      <CheckCircle className='mr-1 size-3' />
                                      Accept
                                    </Button>
                                  )}
                                <Button
                                  size='sm'
                                  variant='ghost'
                                  onClick={() => setDeleteAnswerId(answer.id)}
                                  disabled={deleteAnswerMutation.isPending}
                                  className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                                >
                                  <Trash2 className='size-3' />
                                </Button>
                              </div>
                            </div>
                          </>
                        )}
                        <Separator className='mt-3' />
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
          <div className='mt-4 flex justify-end'>
            <Button variant='outline' onClick={() => setOpen('answers')}>
              <X className='mr-2 size-4' />
              Close
            </Button>
          </div>
        </DrawerContent>
      </Drawer>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={!!deleteAnswerId}
        onOpenChange={() => setDeleteAnswerId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Answer</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this answer? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteAnswer}
              className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
