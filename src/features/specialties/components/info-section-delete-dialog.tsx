/**
 * Info Section Delete Dialog
 * Confirmation dialog for deleting an info section
 */
import { Loader2 } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { type SpecialtyInfoSection } from '../data/schema'
import { useDeleteInfoSection } from '../data/use-specialties'

interface InfoSectionDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  section: SpecialtyInfoSection
  specialtyId: string
}

export function InfoSectionDeleteDialog({
  open,
  onOpenChange,
  section,
  specialtyId,
}: InfoSectionDeleteDialogProps) {
  const deleteMutation = useDeleteInfoSection()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync({
        id: section.id,
        specialtyId,
      })
      onOpenChange()
    } catch (error) {
      // Error handling is done in the mutation hook
      console.error('Delete error:', error)
    }
  }

  const isLoading = deleteMutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Info Section?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to delete the section{' '}
            <span className='font-semibold'>&quot;{section.name}&quot;</span>?
            This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={onOpenChange}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
            Delete
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

