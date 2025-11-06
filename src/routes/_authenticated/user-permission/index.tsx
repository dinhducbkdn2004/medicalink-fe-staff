import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UserPermission } from '@/features/permissions/user-permission'

const userPermissionSearchSchema = z.object({})

export const Route = createFileRoute('/_authenticated/user-permission/')({
  validateSearch: userPermissionSearchSchema,
  component: UserPermission,
})
