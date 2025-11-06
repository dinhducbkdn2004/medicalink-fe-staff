/**
 * Assign Permission Form
 * Form for assigning new permissions to a group
 */
import { useState } from 'react'
import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import type { Resource, Action } from '@/api/types/permission.types'
import { Button } from '@/components/ui/button'
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
import { useAssignGroupPermission } from '../../hooks'

const assignPermissionSchema = z.object({
  effect: z.enum(['ALLOW', 'DENY']).default('ALLOW'),
})

type AssignPermissionFormValues = z.infer<typeof assignPermissionSchema>

type AssignPermissionFormProps = {
  groupId: string
  tenantId?: string
  onSuccess?: () => void
}

export function AssignPermissionForm({
  groupId,
  tenantId,
  onSuccess,
}: AssignPermissionFormProps) {
  const [selectedResource, setSelectedResource] = useState<Resource>()
  const [selectedActions, setSelectedActions] = useState<Action[]>([])

  const assignMutation = useAssignGroupPermission()

  const form = useForm<AssignPermissionFormValues>({
    resolver: zodResolver(assignPermissionSchema),
    defaultValues: {
      effect: 'ALLOW',
    },
  })

  const onSubmit = async (data: AssignPermissionFormValues) => {
    if (!selectedResource || selectedActions.length === 0) {
      return
    }

    try {
      // Assign each selected action
      for (const action of selectedActions) {
        // Build permissionId in format: perm_{resource}_{action}
        const permissionId = `perm_${selectedResource}_${action}`
        
        await assignMutation.mutateAsync({
          groupId,
          data: {
            permissionId,
            effect: data.effect,
            tenantId,
          },
        })
      }

      // Reset form
      setSelectedResource(undefined)
      setSelectedActions([])
      form.reset()

      onSuccess?.()
    } catch {
      // Error handling is done in mutation hook
    }
  }

  const canSubmit = selectedResource && selectedActions.length > 0

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
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
                <FormLabel className='text-base'>Permission Effect</FormLabel>
                <FormDescription>
                  ALLOW grants access. Turn off to DENY these permissions explicitly.
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

        <div className='flex justify-end gap-2'>
          <Button
            type='submit'
            disabled={!canSubmit || assignMutation.isPending}
          >
            {assignMutation.isPending ? 'Assigning...' : 'Assign Permissions'}
          </Button>
        </div>
      </form>
    </Form>
  )
}
