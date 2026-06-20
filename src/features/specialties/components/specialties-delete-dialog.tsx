
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
          <AlertDialogTitle>Bạn có chắc chắn không?</AlertDialogTitle>
          <AlertDialogDescription>
            Thao tác này sẽ xóa chuyên khoa{' '}
            <span className='font-semibold'>&quot;{currentRow.name}&quot;</span>
            .
          </AlertDialogDescription>
        </AlertDialogHeader>

        {currentRow.infoSectionsCount && currentRow.infoSectionsCount > 0 && (
          <Alert variant='destructive'>
            <AlertTriangle className='size-4' />
            <AlertDescription>
              Chuyên khoa này có {currentRow.infoSectionsCount} phần thông tin
              cũng sẽ bị ảnh hưởng. Nó cũng có thể đang được gán cho các bác sĩ đang hoạt động.
            </AlertDescription>
          </Alert>
        )}

        <AlertDialogFooter>
          <Button
            variant='outline'
            onClick={onOpenChange}
            disabled={isLoading}
          >
            Hủy
          </Button>
          <Button
            variant='destructive'
            onClick={handleDelete}
            disabled={isLoading}
          >
            {isLoading && <Loader2 className='mr-2 size-4 animate-spin' />}
            Xóa
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}

