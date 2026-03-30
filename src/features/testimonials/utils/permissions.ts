import { can } from '@/lib/permission-utils'

export function canReadTestimonials(): boolean {
  return can('testimonials', 'read')
}

export function canCreateTestimonial(): boolean {
  return can('testimonials', 'create')
}

export function canUpdateTestimonial(): boolean {
  return can('testimonials', 'update')
}

export function canToggleFeatured(): boolean {
  return can('testimonials', 'update')
}

export function canDeleteTestimonial(): boolean {
  return can('testimonials', 'delete')
}
