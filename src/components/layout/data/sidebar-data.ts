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
} from 'lucide-react'
import type { NavGroupWithPermission } from '@/lib/sidebar-utils'

export const navGroups: NavGroupWithPermission[] = [
  {
    title: 'Dashboard',
    items: [
      {
        title: 'Dashboard',
        url: '/',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    title: 'User & Access Control',
    items: [
      {
        title: 'User Management',
        icon: Users,
        items: [
          {
            title: 'Staff Accounts',
            url: '/staffs',
            icon: UserRoundCog,
            permission: { resource: 'staff', action: 'read' },
          },
          {
            title: 'Doctor Accounts',
            url: '/doctors',
            icon: Stethoscope,

            permission: { resource: 'doctors', action: 'manage' },
          },
        ],
      },
      {
        title: 'Permission',
        icon: Shield,
        items: [
          {
            title: 'Group Manager',
            url: '/group-manager',
            icon: UsersRound,
            permission: { resource: 'permissions', action: 'manage' },
          },
          {
            title: 'User Permission',
            url: '/user-permission',
            icon: ShieldCheck,
            permission: { resource: 'permissions', action: 'manage' },
          },
          {
            title: 'User Group',
            url: '/user-group',
            icon: UsersRound,
            permission: { resource: 'groups', action: 'manage' },
          },
        ],
      },
    ],
  },
  {
    title: 'Hospital Configuration',
    items: [
      {
        title: 'Specialties',
        url: '/specialties',
        icon: Stethoscope,
        permission: { resource: 'specialties', action: 'read' },
      },
      {
        title: 'Work Locations',
        url: '/work-locations',
        icon: MapPin,
        permission: { resource: 'work-locations', action: 'manage' },
      },
      {
        title: 'Office Hours',
        url: '/office-hours',
        icon: Clock,

        permission: { resource: 'office-hours', action: 'manage' },
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        title: 'Appointments',
        url: '/appointments',
        icon: CalendarDays,
        permission: { resource: 'appointments', action: 'read' },
      },
      {
        title: 'Patients',
        url: '/patients',
        icon: UserRound,
        permission: { resource: 'patients', action: 'read' },
      },
      {
        title: 'Q&A',
        url: '/questions',
        icon: MessageCircleQuestion,
        permission: { resource: 'questions', action: 'read' },
      },
      {
        title: 'Reviews',
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
    title: 'Content Management',
    items: [
      {
        title: 'Blog Categories',
        url: '/blogs/categories',
        icon: BookOpen,
        permission: { resource: 'blogs', action: 'manage' },
      },
      {
        title: 'All Blogs',
        url: '/blogs/list',
        icon: FileText,
        permission: { resource: 'blogs', action: 'read' },
      },
    ],
  },
  {
    title: 'Other',
    items: [
      {
        title: 'Settings',
        icon: Settings,
        items: [
          {
            title: 'General',
            url: '/settings',
            icon: Wrench,
          },
          {
            title: 'Appearance',
            url: '/settings/appearance',
            icon: Palette,
          },
          {
            title: 'Notifications',
            url: '/settings/notifications',
            icon: Bell,
          },
        ],
      },
      {
        title: 'Help Center',
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
