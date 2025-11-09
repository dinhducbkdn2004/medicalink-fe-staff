/**
 * Reviews Feature - Static Data
 * Filter options and constants
 */
import { CheckCircle, Clock, XCircle, Star } from 'lucide-react'

// ============================================================================
// Filter Options
// ============================================================================

export const statusOptions = [
  {
    label: 'Pending',
    value: 'PENDING',
    icon: Clock,
  },
  {
    label: 'Approved',
    value: 'APPROVED',
    icon: CheckCircle,
  },
  {
    label: 'Rejected',
    value: 'REJECTED',
    icon: XCircle,
  },
]

export const ratingOptions = [
  {
    label: '5 Stars',
    value: '5',
    icon: Star,
  },
  {
    label: '4 Stars',
    value: '4',
    icon: Star,
  },
  {
    label: '3 Stars',
    value: '3',
    icon: Star,
  },
  {
    label: '2 Stars',
    value: '2',
    icon: Star,
  },
  {
    label: '1 Star',
    value: '1',
    icon: Star,
  },
]
