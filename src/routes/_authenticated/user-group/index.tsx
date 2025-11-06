import { z } from 'zod'
import { createFileRoute } from '@tanstack/react-router'
import { UserGroup } from '@/features/permissions/user-group'

const userGroupSearchSchema = z.object({})

export const Route = createFileRoute('/_authenticated/user-group/')({
  validateSearch: userGroupSearchSchema,
  component: UserGroup,
})
