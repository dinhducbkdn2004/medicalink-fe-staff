import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resource, Action } from '@/api/types/permission.types'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from '@/components/ui/form'
import { Switch } from '@/components/ui/switch'
import { ResourceActionSelector } from '../../components'
import { useAssignUserPermission, usePermissions } from '../../hooks'

const assignPermissionSchema = z.object({
  effect: z.enum(['ALLOW', 'DENY']).default('ALLOW'),
})

type AssignPermissionFormValues = z.infer<typeof assignPermissionSchema>

type AssignUserPermissionDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  userId?: string
}

export function AssignUserPermissionDialog({
  open,
  onOpenChange,
  userId,
}: AssignUserPermissionDialogProps) {
  const [selectedResource, setSelectedResource] = useState<Resource>()
  const [selectedActions, setSelectedActions] = useState<Action[]>([])

  const { data: allPermissions } = usePermissions()
  const assignMutation = useAssignUserPermission()

  const form = useForm<AssignPermissionFormValues>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(assignPermissionSchema) as any,
    defaultValues: {
      effect: 'ALLOW',
    },
  })

  const onSubmit = async (data: AssignPermissionFormValues) => {
    if (
      !userId ||
      !selectedResource ||
      selectedActions.length === 0 ||
      !allPermissions
    ) {
      return
    }

    try {
      for (const action of selectedActions) {
        const permission = allPermissions.find(
          (p) => p.resource === selectedResource && p.action === action
        )

        if (!permission) {
          console.warn(`Permission not found for ${selectedResource}:${action}`)
          continue
        }

        await assignMutation.mutateAsync({
          userId,
          permissionId: permission.id,
          effect: data.effect,
        })
      }

      handleClose()
    } catch {
      void 0
    }
  }

  const handleClose = () => {
    setSelectedResource(undefined)
    setSelectedActions([])
    form.reset()
    onOpenChange(false)
  }

  const canSubmit = userId && selectedResource && selectedActions.length > 0

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-h-[85vh] max-w-2xl overflow-hidden'>
        <DialogHeader>
          <DialogTitle>Assign User Permission</DialogTitle>
          <DialogDescription>
            Assign direct permissions to the selected user.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex max-h-full flex-col space-y-6 overflow-hidden'
          >
            <div className='overflow-y-auto pr-2'>
              <div className='space-y-6'>
                <ResourceActionSelector
                  selectedResource={selectedResource}
                  selectedActions={selectedActions}
                  onResourceChange={setSelectedResource}
                  onActionsChange={setSelectedActions}
                  disabled={assignMutation.isPending}
                />

                <FormField
                  control={form.control}
                  name='effect'
                  render={({ field }) => (
                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4'>
                      <div className='space-y-0.5'>
                        <FormLabel className='text-base'>
                          Permission Effect
                        </FormLabel>
                        <FormDescription>
                          ALLOW grants access. Turn off to DENY these
                          permissions explicitly.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch
                          checked={field.value === 'ALLOW'}
                          onCheckedChange={(checked) =>
                            field.onChange(checked ? 'ALLOW' : 'DENY')
                          }
                          disabled={assignMutation.isPending}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <DialogFooter className='flex-shrink-0'>
              <Button
                type='button'
                variant='outline'
                onClick={handleClose}
                disabled={assignMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type='submit'
                disabled={!canSubmit || assignMutation.isPending}
              >
                {assignMutation.isPending
                  ? 'Assigning...'
                  : 'Assign Permissions'}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
