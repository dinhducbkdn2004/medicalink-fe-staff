import { Shield, UserCheck } from 'lucide-react'

export const staffRoles = [
  {
    label: 'Quản trị viên cấp cao',
    value: 'SUPER_ADMIN',
    icon: Shield,
    description: 'Toàn quyền hệ thống, có thể quản lý tất cả tài nguyên',
  },
  {
    label: 'Quản trị viên',
    value: 'ADMIN',
    icon: UserCheck,
    description:
      'Có thể quản lý hầu hết tài nguyên ngoại trừ quản trị viên cấp cao',
  },
] as const

export const genderOptions = [
  { label: 'Nam', value: 'true' },
  { label: 'Nữ', value: 'false' },
] as const

export const sortByOptions = [
  { label: 'Ngày tạo', value: 'createdAt' },
  { label: 'Họ và tên', value: 'fullName' },
  { label: 'Email', value: 'email' },
] as const

export const sortOrderOptions = [
  { label: 'Tăng dần', value: 'asc' },
  { label: 'Giảm dần', value: 'desc' },
] as const
