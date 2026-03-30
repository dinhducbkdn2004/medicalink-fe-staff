import { createFileRoute } from '@tanstack/react-router'
import { GroupPermissionsEditor } from '@/features/permissions/group-manager/group-permissions-editor'

export const Route = createFileRoute('/_authenticated/group-manager/permissions/$groupId')({
  component: GroupPermissionsRoute,
})

function GroupPermissionsRoute() {
  const { groupId } = Route.useParams()
  return <GroupPermissionsEditor groupId={groupId} />
}
