import { useMemo } from 'react'
import { useLayout } from '@/context/layout-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/auth-store'
import { filterNavGroups } from '@/lib/sidebar-utils'
import { navGroups, teams } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

/**
 * AppSidebar Component
 * Renders role-based sidebar navigation
 * - Super Admin: Full access
 * - Admin: Limited access (no Permission management)
 * - Doctor: TBD
 */
export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { user } = useAuthStore()

  // Filter navigation groups based on user role
  const filteredNavGroups = useMemo(() => {
    return filterNavGroups(navGroups, user?.role)
  }, [user?.role])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />

        {/* Replace <TeamSwitch /> with the following <AppTitle />
         /* if you want to use the normal app title instead of TeamSwitch dropdown */}
        {/* <AppTitle /> */}
      </SidebarHeader>
      <SidebarContent>
        {filteredNavGroups.map((props) => (
          <NavGroup key={props.title} {...props} />
        ))}
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
