import { createFileRoute } from '@tanstack/react-router'
import { UserGroupManage } from '@/features/permissions/user-group/user-group-manage'

export const Route = createFileRoute('/_authenticated/user-group/$userId')({
  component: UserGroupManageRoute,
})

function UserGroupManageRoute() {
  const { userId } = Route.useParams()
  return <UserGroupManage userId={userId} />
}
