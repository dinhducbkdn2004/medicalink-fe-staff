/**
 * Work Location Data Definitions
 * Static data for filters, options, etc.
 */
import { CheckCircle, XCircle } from 'lucide-react'

// Status options for filtering
export const statusOptions = [
  {
    label: 'Active',
    value: 'true',
    icon: CheckCircle,
  },
  {
    label: 'Inactive',
    value: 'false',
    icon: XCircle,
  },
]

// Sort options
export const sortOptions = [
  {
    label: 'Name',
    value: 'name',
  },
  {
    label: 'Created Date',
    value: 'createdAt',
  },
  {
    label: 'Updated Date',
    value: 'updatedAt',
  },
]
