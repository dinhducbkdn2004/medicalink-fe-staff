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


export function AppSidebar() {
  const { collapsible, variant } = useLayout()
  const { can, isLoaded } = usePermissions()
  const { user } = useAuthStore()

  
  const filteredNavGroups = useMemo(() => {
    if (!isLoaded) {
      
      return []
    }
    return filterNavGroups(navGroups, can, user?.role)
  }, [can, isLoaded, user?.role])

  return (
    <Sidebar collapsible={collapsible} variant={variant}>
      <SidebarHeader>
        <TeamSwitcher teams={teams} />

        {}
        {}
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
