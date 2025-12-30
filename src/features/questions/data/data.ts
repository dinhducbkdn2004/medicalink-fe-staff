import { Clock, XCircle, MessageCircle } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Pending',
    value: 'PENDING',
    icon: Clock,
  },
  {
    label: 'Answered',
    value: 'ANSWERED',
    icon: MessageCircle,
  },
  {
    label: 'Closed',
    value: 'CLOSED',
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
