import { useMemo } from 'react'
import { useAuthStore } from '@/stores/auth-store'
import { filterNavGroups } from '@/lib/sidebar-utils'
import { useLayout } from '@/context/layout-provider'
import { usePermissions } from '@/context/permission-provider'
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar'
import { navGroups, teams } from './data/sidebar-data'
import { NavGroup } from './nav-group'
import { NavUser } from './nav-user'
import { TeamSwitcher } from './team-switcher'

/**
 * AppSidebar Component
 * Renders permission-based sidebar navigation
 *
 * Navigation items are filtered based on user permissions from the API.
 * When SuperAdmin/Admin grants new permissions, the sidebar automatically
 * updates to show the newly accessible items.
 */
export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { can, isLoaded } = usePermissions()
  const { user } = useAuthStore()

  // Filter navigation groups based on user permissions and role
  const filteredNavGroups = useMemo(() => {
    if (!isLoaded) {
      // Return empty while loading to prevent flash of unauthorized content
      return []
    }
    return filterNavGroups(navGroups, can, user?.role)
  }, [can, isLoaded, user?.role])

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
