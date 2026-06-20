import { CheckCircle2, XCircle, User, UserX } from 'lucide-react'

export const statusOptions = [
  {
    label: 'Hoạt động',
    value: 'false',
    icon: CheckCircle2,
  },
  {
    label: 'Đã xóa',
    value: 'true',
    icon: XCircle,
  },
] as const

export const genderOptions = [
  { label: 'Nam', value: 'true', icon: User },
  { label: 'Nữ', value: 'false', icon: UserX },
] as const

export const sortByOptions = [
  { label: 'Ngày tạo', value: 'createdAt' },
  { label: 'Ngày cập nhật', value: 'updatedAt' },
  { label: 'Ngày sinh', value: 'dateOfBirth' },
  { label: 'Họ và tên', value: 'fullName' },
] as const

export const sortOrderOptions = [
  { label: 'Tăng dần', value: 'asc' },
  { label: 'Giảm dần', value: 'desc' },
] as const
