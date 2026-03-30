import { can } from '@/lib/permission-utils'

export function canReadFaqs(): boolean {
  return can('faqs', 'read')
}

export function canCreateFaq(): boolean {
  return can('faqs', 'create')
}

export function canUpdateFaq(): boolean {
  return can('faqs', 'update')
}

export function canToggleFaq(): boolean {
  return can('faqs', 'update')
}

export function canDeleteFaq(): boolean {
  return can('faqs', 'delete')
}
