import { CheckCircle, XCircle } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Hoạt động',
    value: 'true',
    icon: CheckCircle,
  },
  {
    label: 'Ngừng hoạt động',
    value: 'false',
    icon: XCircle,
  },
]

export const sortOptions = [
  {
    label: 'Tên',
    value: 'name',
  },
  {
    label: 'Ngày tạo',
    value: 'createdAt',
  },
  {
    label: 'Ngày cập nhật',
    value: 'updatedAt',
  },
]
