import { z } from 'zod'

export const testimonialFormSchema = z.object({
  authorName: z.string().min(1).max(120),
  authorAvatar: z.string().max(2048).optional().or(z.literal('')),
  authorTitle: z.string().max(120).optional().or(z.literal('')),
  content: z.string().min(1),
  rating: z.coerce.number().int().min(1).max(5).optional(),
  isFeatured: z.boolean().optional(),
})

export type TestimonialFormValues = z.infer<typeof testimonialFormSchema>
