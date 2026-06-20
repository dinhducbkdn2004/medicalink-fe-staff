import {
  ArrowDown,
  ArrowRight,
  ArrowUp,
  Circle,
  CheckCircle,
  AlertCircle,
  Timer,
  HelpCircle,
  CircleOff,
} from 'lucide-react'

export const labels = [
  {
    value: 'bug',
    label: 'Lỗi',
  },
  {
    value: 'feature',
    label: 'Tính năng',
  },
  {
    value: 'documentation',
    label: 'Tài liệu',
  },
]

export const statuses = [
  {
    label: 'Chưa làm',
    value: 'backlog' as const,
    icon: HelpCircle,
  },
  {
    label: 'Cần làm',
    value: 'todo' as const,
    icon: Circle,
  },
  {
    label: 'Đang làm',
    value: 'in progress' as const,
    icon: Timer,
  },
  {
    label: 'Hoàn thành',
    value: 'done' as const,
    icon: CheckCircle,
  },
  {
    label: 'Đã hủy',
    value: 'canceled' as const,
    icon: CircleOff,
  },
]

export const priorities = [
  {
    label: 'Thấp',
    value: 'low' as const,
    icon: ArrowDown,
  },
  {
    label: 'Trung bình',
    value: 'medium' as const,
    icon: ArrowRight,
  },
  {
    label: 'Cao',
    value: 'high' as const,
    icon: ArrowUp,
  },
  {
    label: 'Nghiêm trọng',
    value: 'critical' as const,
    icon: AlertCircle,
  },
]
