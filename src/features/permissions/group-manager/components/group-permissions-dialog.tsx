/**
 * Group Permissions Dialog
 * Dialog for viewing and managing group permissions
 */
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { PermissionTree } from '../../components'
import {
  useGroupPermissions,
  useAssignGroupPermission,
  useRevokeGroupPermission,
} from '../../hooks'
import { AssignPermissionForm } from './assign-permission-form'
import { useGroupManager } from './use-group-manager'

type GroupPermissionsDialogProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function GroupPermissionsDialog({
  open,
  onOpenChange,
}: Readonly<GroupPermissionsDialogProps>) {
  const { currentGroup, setCurrentGroup } = useGroupManager()

  const { data: permissions, isLoading } = useGroupPermissions(
    currentGroup?.id || ''
  )

  const assignMutation = useAssignGroupPermission()
  const revokeMutation = useRevokeGroupPermission()

  const handlePermissionChange = async (
    resource: string,
    action: string,
    granted: boolean
  ) => {
    if (!currentGroup) return

    // Build permissionId in format: perm_{resource}_{action}
    const permissionId = `perm_${resource}_${action}`

    try {
      if (granted) {
        // Assign permission
        await assignMutation.mutateAsync({
          groupId: currentGroup.id,
          data: {
            permissionId,
            effect: 'ALLOW',
            tenantId: currentGroup.tenantId,
          },
        })
      } else {
        // Revoke permission
        await revokeMutation.mutateAsync({
          groupId: currentGroup.id,
          data: {
            permissionId,
            tenantId: currentGroup.tenantId,
          },
        })
      }
    } catch {
      // Error handling is done in mutation hooks
    }
  }

  const handleClose = () => {
    setCurrentGroup(null)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='flex max-h-[85vh] max-w-4xl flex-col overflow-hidden'>
        <DialogHeader className='shrink-0'>
          <DialogTitle>Manage Permissions: {currentGroup?.name}</DialogTitle>
          <DialogDescription>
            View and modify permissions assigned to this group.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          defaultValue='permissions'
          className='flex min-h-0 flex-1 flex-col'
        >
          <TabsList className='grid w-full shrink-0 grid-cols-2'>
            <TabsTrigger value='permissions'>Permissions</TabsTrigger>
            <TabsTrigger value='assign'>Assign New</TabsTrigger>
          </TabsList>

          <TabsContent
            value='permissions'
            className='mt-4 flex min-h-0 flex-1 flex-col space-y-4'
          >
            <p className='text-muted-foreground shrink-0 text-sm'>
              Click checkboxes to grant or revoke permissions
            </p>

            {isLoading ? (
              <div className='flex flex-1 items-center justify-center'>
                <p className='text-muted-foreground'>Loading permissions...</p>
              </div>
            ) : (
              <div className='min-h-0 flex-1 overflow-y-auto pr-2'>
                <PermissionTree
                  permissions={permissions || []}
                  onPermissionChange={handlePermissionChange}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent
            value='assign'
            className='mt-4 space-y-4 overflow-y-auto'
          >
            {currentGroup && (
              <AssignPermissionForm
                groupId={currentGroup.id}
                tenantId={currentGroup.tenantId}
              />
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
