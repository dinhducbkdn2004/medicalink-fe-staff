import { Link } from '@tanstack/react-router'
import { ArrowLeft, RefreshCw } from 'lucide-react'
import { useMemo } from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { ThemeSwitch } from '@/components/theme-switch'
import { PermissionTree } from '../components'
import {
  useAssignGroupPermission,
  useGroupPermissions,
  usePermissionGroups,
  usePermissions,
  useRevokeGroupPermission,
} from '../hooks'
import { AssignPermissionForm } from './components/assign-permission-form'

type GroupPermissionsEditorProps = {
  groupId: string
}

export function GroupPermissionsEditor({ groupId }: GroupPermissionsEditorProps) {
  const { data: groups } = usePermissionGroups()
  const group = useMemo(
    () => groups?.find((g) => g.id === groupId),
    [groups, groupId]
  )

  const { data: permissions, isLoading } = useGroupPermissions(groupId)
  const { data: allPermissions, isLoading: catalogLoading } = usePermissions()

  const assignMutation = useAssignGroupPermission()
  const revokeMutation = useRevokeGroupPermission()

  const handlePermissionChange = async (
    resource: string,
    action: string,
    granted: boolean
  ) => {
    if (!group || !allPermissions) return

    const permission = allPermissions.find(
      (p) => p.resource === resource && p.action === action
    )

    if (!permission) {
      console.warn(`Permission not found for ${resource}:${action}`)
      return
    }

    try {
      if (granted) {
        await assignMutation.mutateAsync({
          groupId: group.id,
          data: {
            permissionId: permission.id,
            effect: 'ALLOW',
            tenantId: group.tenantId,
          },
        })
      } else {
        await revokeMutation.mutateAsync({
          groupId: group.id,
          data: {
            permissionId: permission.id,
            tenantId: group.tenantId,
          },
        })
      }
    } catch {
      void 0
    }
  }

  return (
    <RequirePermission resource='permissions' action='manage'>
      <Header fixed>
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-center gap-3'>
          <Button variant='ghost' size='sm' asChild>
            <Link to='/group-manager'>
              <ArrowLeft className='mr-2 h-4 w-4' />
              Back to groups
            </Link>
          </Button>
        </div>

        <div className='space-y-1'>
          <h1 className='text-2xl font-bold tracking-tight'>
            Group permissions
            {group?.name ? (
              <span className='text-muted-foreground font-normal'>
                {' '}
                — {group.name}
              </span>
            ) : null}
          </h1>
          <p className='text-muted-foreground text-sm'>
            Full-page editor: toggle permissions in the tree or use Assign new for
            batch selection. Changes match the live permission catalog.
          </p>
        </div>

        <Tabs defaultValue='permissions' className='flex min-h-0 flex-1 flex-col'>
          <TabsList className='grid w-full max-w-md shrink-0 grid-cols-2'>
            <TabsTrigger value='permissions'>Permissions</TabsTrigger>
            <TabsTrigger value='assign'>Assign new</TabsTrigger>
          </TabsList>

          <TabsContent
            value='permissions'
            className='mt-4 flex min-h-0 flex-1 flex-col space-y-4'
          >
            <p className='text-muted-foreground shrink-0 text-sm'>
              Use checkboxes to grant or revoke. Conditional rows show a badge.
            </p>

            {isLoading || catalogLoading ? (
              <div className='flex flex-1 items-center justify-center py-20'>
                <div className='flex items-center gap-2'>
                  <RefreshCw className='text-primary h-4 w-4 animate-spin' />
                  <p className='text-muted-foreground text-sm'>
                    Loading catalog and group permissions…
                  </p>
                </div>
              </div>
            ) : (
              <div className='min-h-0 flex-1 max-w-5xl overflow-y-auto pr-2'>
                <PermissionTree
                  catalog={allPermissions ?? []}
                  assigned={permissions || []}
                  onPermissionChange={handlePermissionChange}
                />
              </div>
            )}
          </TabsContent>

          <TabsContent value='assign' className='mt-4 max-w-2xl space-y-4'>
            {group ? (
              <AssignPermissionForm
                groupId={group.id}
                tenantId={group.tenantId}
              />
            ) : (
              <p className='text-muted-foreground text-sm'>
                Group not found. Return to the group list and try again.
              </p>
            )}
          </TabsContent>
        </Tabs>
      </Main>
    </RequirePermission>
  )
}
