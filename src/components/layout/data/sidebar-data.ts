import {
  LayoutDashboard,
  Monitor,
  HelpCircle,
  Bell,
  Palette,
  Settings,
  Wrench,
  UserCog,
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
import type { UserRole } from '@/api/types/auth.types'
import type { NavGroupWithAccess } from '@/lib/sidebar-utils'

/**
 * Define role-based sidebar navigation
 * Super Admin: Full access to all features
 * Admin: Limited access (no Permission management)
 * Doctor: Will have separate UI (not implemented yet)
 */
export const navGroups: NavGroupWithAccess[] = [
  {
    title: 'Dashboard',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
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
        allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
        items: [
          {
            title: 'Staff Accounts',
            url: '/staffs',
            icon: UserRoundCog,
          },
          {
            title: 'Doctor Accounts',
            url: '/doctors',
            icon: Stethoscope,
          },
        ],
      },
      {
        title: 'Permission',
        icon: Shield,
        allowedRoles: ['SUPER_ADMIN'], // Only Super Admin can access
        items: [
          {
            title: 'Group Manager',
            url: '/group-manager',
            icon: UsersRound,
          },
          {
            title: 'User Permission',
            url: '/user-permission',
            icon: ShieldCheck,
          },
          {
            title: 'User Group',
            url: '/user-group',
            icon: UsersRound,
          },
        ],
      },
    ],
  },
  {
    title: 'Hospital Configuration',
    allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
    items: [
      {
        title: 'Specialties',
        url: '/specialties',
        icon: Stethoscope,
      },
      {
        title: 'Work Locations',
        url: '/work-locations',
        icon: MapPin,
      },
      {
        title: 'Office Hours',
        url: '/office-hours',
        icon: Clock,
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
      },
      {
        title: 'Patients',
        url: '/patients',
        icon: UserRound,
      },
      {
        title: 'Q&A',
        url: '/questions',
        icon: MessageCircleQuestion,
      },
      {
        title: 'Reviews',
        url: '/reviews',
        icon: Star,
        allowedRoles: ['DOCTOR'],
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
        allowedRoles: ['SUPER_ADMIN', 'ADMIN'],
      },
      {
        title: 'All Blogs',
        url: '/blogs/list',
        icon: FileText,
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
            title: 'Profile',
            url: '/settings',
            icon: UserCog,
          },
          {
            title: 'Account',
            url: '/settings/account',
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
          {
            title: 'Display',
            url: '/settings/display',
            icon: Monitor,
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

/**
 * Default teams configuration
 */
export const teams = [
  {
    name: 'MedicaLink',
    logo: Stethoscope,
    plan: 'Staff Portal',
  },
  {
    name: 'MedicaLink Admin',
    logo: ShieldCheck,
    plan: 'Management',
  },
]

/**
 * Get sidebar data with role-based filtering
 */
export function getSidebarData(userRole?: UserRole) {
  return {
    teams,
    navGroups,
    userRole,
  }
}
