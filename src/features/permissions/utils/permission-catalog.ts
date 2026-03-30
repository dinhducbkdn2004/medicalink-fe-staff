import type { Permission } from '@/api/types/permission.types'

/** Resource grouping by domain — aligned with the RBAC backend. */
export type PermissionModuleMeta = {
  id: string
  title: string
  description?: string
  resources: string[]
}

export const PERMISSION_MODULES: PermissionModuleMeta[] = [
  {
    id: 'auth',
    title: 'Authentication & sessions',
    description: 'Sign-in, sign-out, token refresh',
    resources: ['auth'],
  },
  {
    id: 'staffing',
    title: 'Internal staffing',
    description: 'Admin / superadmin accounts',
    resources: ['staff'],
  },
  {
    id: 'clinical',
    title: 'Clinical & patients',
    description: 'Doctors, patients, specialties',
    resources: ['doctors', 'patients', 'specialties'],
  },
  {
    id: 'booking',
    title: 'Appointments & sites',
    description: 'Appointments, schedules, office hours, locations',
    resources: ['appointments', 'schedules', 'office-hours', 'work-locations'],
  },
  {
    id: 'content',
    title: 'Content & community',
    description: 'Blogs, FAQs, testimonials, Q&A',
    resources: ['blogs', 'faqs', 'testimonials', 'questions', 'answers'],
  },
  {
    id: 'feedback',
    title: 'Reviews',
    description: 'Patient reviews',
    resources: ['reviews'],
  },
  {
    id: 'notifications',
    title: 'Notifications',
    description: 'Send and manage notifications',
    resources: ['notifications'],
  },
  {
    id: 'system',
    title: 'System & RBAC',
    description: 'System flags, groups, permission grants',
    resources: ['system', 'permissions', 'groups'],
  },
]

const RESOURCE_TO_MODULE_ID = new Map<string, string>()
for (const mod of PERMISSION_MODULES) {
  for (const r of mod.resources) {
    RESOURCE_TO_MODULE_ID.set(r, mod.id)
  }
}

export function getModuleIdForResource(resource: string): string {
  return RESOURCE_TO_MODULE_ID.get(resource) ?? 'other'
}

export function getModuleMeta(moduleId: string): PermissionModuleMeta {
  return (
    PERMISSION_MODULES.find((m) => m.id === moduleId) ?? {
      id: 'other',
      title: 'Other',
      description: 'Uncategorized resources',
      resources: [],
    }
  )
}

/** Group API permission definitions by module → resource. */
export function groupCatalogByModule(allPermissions: Permission[]) {
  const byResource = new Map<string, Permission[]>()
  for (const p of allPermissions) {
    const list = byResource.get(p.resource) ?? []
    list.push(p)
    byResource.set(p.resource, list)
  }
  for (const [, list] of byResource) {
    list.sort((a, b) => a.action.localeCompare(b.action))
  }

  const moduleIds = new Set<string>()
  for (const r of byResource.keys()) {
    moduleIds.add(getModuleIdForResource(r))
  }

  const orderedModuleIds = [
    ...PERMISSION_MODULES.map((m) => m.id),
    ...Array.from(moduleIds).filter(
      (id) => !PERMISSION_MODULES.some((m) => m.id === id)
    ),
  ]

  return orderedModuleIds
    .map((moduleId) => {
      const meta = getModuleMeta(moduleId)
      const resourcesInModule = [...byResource.keys()].filter(
        (res) => getModuleIdForResource(res) === moduleId
      )
      resourcesInModule.sort((a, b) => a.localeCompare(b))

      return {
        moduleId,
        meta,
        resources: resourcesInModule.map((resource) => ({
          resource,
          permissions: byResource.get(resource) ?? [],
        })),
      }
    })
    .filter((m) => m.resources.length > 0)
}

export function formatResourceLabel(resource: string): string {
  return resource.replace(/-/g, ' ')
}
