import { createFileRoute } from '@tanstack/react-router'
import { UserPermissionManage } from '@/features/permissions/user-permission/user-permission-manage'

export const Route = createFileRoute('/_authenticated/user-permission/$userId')({
  component: UserPermissionManageRoute,
})

function UserPermissionManageRoute() {
  const { userId } = Route.useParams()
  return <UserPermissionManage userId={userId} />
}
