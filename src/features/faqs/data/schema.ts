import { z } from 'zod'

export const faqFormSchema = z.object({
  question: z.string().min(1, 'Required').max(255, 'Maximum 255 characters'),
  answer: z.string().min(1, 'Required'),
  order: z.coerce.number().int().min(0).optional(),
  isActive: z.boolean().optional(),
})

export type FaqFormValues = z.infer<typeof faqFormSchema>
