
import { Loader2, AlertTriangle } from 'lucide-react'

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { type Specialty } from '../data/schema'
import { useDeleteSpecialty } from '../data/use-specialties'

interface SpecialtiesDeleteDialogProps {
  open: boolean
  onOpenChange: () => void
  currentRow: Specialty
}

export function SpecialtiesDeleteDialog({
  open,
  onOpenChange,
  currentRow,
}: SpecialtiesDeleteDialogProps) {
  const deleteMutation = useDeleteSpecialty()

  const handleDelete = async () => {
    try {
      await deleteMutation.mutateAsync(currentRow.id)
      onOpenChange()
    } catch (error) {
      
      console.error('Delete error:', error)
    }
  }

  const isLoading = deleteMutation.isPending

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action will delete the specialty{' '}
            <span className='font-semibold'>&quot;{currentRow.name}&quot;</span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        {currentRow.infoSectionsCount && currentRow.infoSectionsCount > 0 && (
          <Alert variant='destructive'>
            <AlertTriangle className='size-4' />
            <AlertDescription>
              This specialty has {currentRow.infoSectionsCount} info section
              {currentRow.infoSectionsCount > 1 ? 's' : ''} that will also be
              affected. It may also be assigned to active doctors.
            </AlertDescription>
          </Alert>
        )}

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

