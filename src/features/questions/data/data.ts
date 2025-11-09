/**
 * Questions Feature - Static Data
 * Filter options and static data for questions
 */
import { CheckCircle2, Clock, XCircle, MessageCircle } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Pending',
    value: 'PENDING',
    icon: Clock,
  },
  {
    label: 'Approved',
    value: 'APPROVED',
    icon: CheckCircle2,
  },
  {
    label: 'Answered',
    value: 'ANSWERED',
    icon: MessageCircle,
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
    icon: XCircle,
  },
] as const

export const sortOptions = [
  {
    label: 'Latest',
    value: 'createdAt:desc',
  },
  {
    label: 'Oldest',
    value: 'createdAt:asc',
  },
  {
    label: 'Most Views',
    value: 'viewCount:desc',
  },
  {
    label: 'Most Answers',
    value: 'answerCount:desc',
  },
] as const
