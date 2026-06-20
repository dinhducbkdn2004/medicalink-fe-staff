import {
  LayoutDashboard,
  HelpCircle,
  Bell,
  Palette,
  Settings,
  Wrench,
  Users,
  ShieldCheck,
  UserRoundCog,
  Shield,
  UsersRound,
  Stethoscope,
  MapPin,
  Clock,
  CalendarDays,
  Star,
  MessageCircleQuestion,
  UserRound,
  BookOpen,
  FileText,
  Quote,
  CalendarOff,
} from 'lucide-react'
import type { NavGroupWithPermission } from '@/lib/sidebar-utils'

export const navGroups: NavGroupWithPermission[] = [
  {
    title: 'Bảng điều khiển',
    items: [
      {
        title: 'Bảng điều khiển',
        url: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'Quản lý người dùng & Phân quyền',
    items: [
      {
        title: 'Quản lý người dùng',
        icon: Users,
        items: [
          {
            title: 'Tài khoản nhân viên',
            url: '/staffs',
            icon: UserRoundCog,
            permission: { resource: 'staff', action: 'read' },
          },
          {
            title: 'Tài khoản bác sĩ',
            url: '/doctors',
            icon: Stethoscope,

            permission: { resource: 'doctors', action: 'manage' },
          },
        ],
      },
      {
        title: 'Phân quyền',
        icon: Shield,
        items: [
          {
            title: 'Quản lý nhóm',
            url: '/group-manager',
            icon: UsersRound,
            permission: { resource: 'permissions', action: 'manage' },
          },
          {
            title: 'Quyền người dùng',
            url: '/user-permission',
            icon: ShieldCheck,
            permission: { resource: 'permissions', action: 'manage' },
          },
          {
            title: 'Nhóm người dùng',
            url: '/user-group',
            icon: UsersRound,
            permission: { resource: 'groups', action: 'manage' },
          },
        ],
      },
    ],
  },
  {
    title: 'Cấu hình phòng khám',
    items: [
      {
        title: 'Chuyên khoa',
        url: '/specialties',
        icon: Stethoscope,
        permission: { resource: 'specialties', action: 'read' },
      },
      {
        title: 'Cơ sở làm việc',
        url: '/work-locations',
        icon: MapPin,
        permission: { resource: 'work-locations', action: 'manage' },
      },
      {
        title: 'Giờ làm việc',
        url: '/office-hours',
        icon: Clock,

        permission: { resource: 'office-hours', action: 'manage' },
      },
      {
        title: 'Ngày nghỉ lễ',
        url: '/holidays',
        icon: CalendarOff,
        permission: { resource: 'office-hours', action: 'read' },
      },
    ],
  },
  {
    title: 'Vận hành',
    items: [
      {
        title: 'Lịch của tôi',
        url: '/my-schedule',
        icon: Clock,
        permission: {
          resource: 'schedules',
          action: 'read',
          roleRequired: ['DOCTOR'],
        },
      },
      {
        title: 'Lịch hẹn',
        url: '/appointments',
        icon: CalendarDays,
        permission: { resource: 'appointments', action: 'read' },
      },
      {
        title: 'Bệnh nhân',
        url: '/patients',
        icon: UserRound,
        permission: { resource: 'patients', action: 'read' },
      },
      {
        title: 'Hỏi đáp',
        url: '/questions',
        icon: MessageCircleQuestion,
        permission: { resource: 'questions', action: 'read' },
      },
      {
        title: 'Đánh giá',
        url: '/reviews',
        icon: Star,
        permission: {
          resource: 'reviews',
          action: 'read',
          roleRequired: ['DOCTOR'],
        },
      },
    ],
  },
  {
    title: 'Quản lý nội dung',
    items: [
      {
        title: 'Danh mục bài viết',
        url: '/blogs/categories',
        icon: BookOpen,
        permission: { resource: 'blogs', action: 'manage' },
      },
      {
        title: 'Tất cả bài viết',
        url: '/blogs/list',
        icon: FileText,
        permission: { resource: 'blogs', action: 'read' },
      },
      {
        title: 'Câu hỏi thường gặp',
        url: '/faqs',
        icon: HelpCircle,
        permission: { resource: 'faqs', action: 'read' },
      },
      {
        title: 'Phản hồi khách hàng',
        url: '/testimonials',
        icon: Quote,
        permission: { resource: 'testimonials', action: 'read' },
      },
    ],
  },
  {
    title: 'Khác',
    items: [
      {
        title: 'Cài đặt',
        icon: Settings,
        items: [
          {
            title: 'Cài đặt chung',
            url: '/settings',
            icon: Wrench,
          },
          {
            title: 'Giao diện',
            url: '/settings/appearance',
            icon: Palette,
          },
          {
            title: 'Thông báo',
            url: '/settings/notifications',
            icon: Bell,
          },
        ],
      },
      {
        title: 'Trung tâm trợ giúp',
        url: '/help-center',
        icon: HelpCircle,
      },
    ],
  },
]

export const teams = [
  {
    name: 'MedicaLink',
    logo: Stethoscope,
    plan: 'Staff Portal',
  },
  {
    name: 'MedicaLink Admin',
    logo: Shield,
    plan: 'Management',
  },
]

export function getSidebarData() {
  return {
    teams,
    navGroups,
  }
}
