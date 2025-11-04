import { z } from 'zod'

/**
 * Staff role schema matching the Staffs API
 * Supports SUPER_ADMIN and ADMIN roles
 */
const staffRoleSchema = z.union([z.literal('SUPER_ADMIN'), z.literal('ADMIN')])
export type StaffRole = z.infer<typeof staffRoleSchema>

/**
 * Staff account schema matching the Staffs API response structure
 * Based on GET /api/staffs endpoint
 */
const staffSchema = z.object({
  id: z.string(),
  fullName: z.string(),
  email: z.string().email(),
  role: staffRoleSchema,
  phone: z.string().nullable().optional(),
  isMale: z.boolean().nullable().optional(),
  dateOfBirth: z.string().nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
})
export type Staff = z.infer<typeof staffSchema>

export const staffListSchema = z.array(staffSchema)

/**
 * Staff statistics schema matching the Staffs API stats endpoint
 * Based on GET /api/staffs/stats
 */
export const staffStatsSchema = z.object({
  total: z.number(),
  active: z.number(),
  inactive: z.number(),
  recentlyCreated: z.number(),
  byRole: z.object({
    SUPER_ADMIN: z.number(),
    ADMIN: z.number(),
  }),
})
export type StaffStats = z.infer<typeof staffStatsSchema>

/**
 * Staff filter parameters schema matching the Staffs API query params
 * Based on GET /api/staffs query parameters
 */
export const staffFilterSchema = z.object({
  page: z.number().min(1).optional(),
  limit: z.number().min(1).max(100).optional(),
  role: staffRoleSchema.optional(),
  search: z.string().optional(),
  email: z.string().email().optional(),
  isMale: z.boolean().optional(),
  isActive: z.boolean().optional(),
  createdFrom: z.string().optional(), // YYYY-MM-DD format
  createdTo: z.string().optional(), // YYYY-MM-DD format
  sortBy: z.enum(['createdAt', 'fullName', 'email']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
})
export type StaffFilter = z.infer<typeof staffFilterSchema>

/**
 * Staff creation payload schema matching the Staffs API POST request
 * Based on POST /api/staffs field validations
 */
export const createStaffSchema = z.object({
  fullName: z.string().min(2).max(100),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(50)
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/\d/, 'Password must contain at least one number'),
  role: staffRoleSchema.default('ADMIN'),
  phone: z.string().optional(),
  isMale: z.boolean().optional(),
  dateOfBirth: z.string().optional(), // YYYY-MM-DD format
})
export type CreateStaffPayload = z.infer<typeof createStaffSchema>

/**
 * Staff update payload schema matching the Staffs API PATCH request
 * Based on PATCH /api/staffs/:id field validations
 * All fields are optional for partial updates
 */
export const updateStaffSchema = createStaffSchema.partial()
export type UpdateStaffPayload = z.infer<typeof updateStaffSchema>
