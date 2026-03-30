import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { getRouteApi } from '@tanstack/react-router'
import type { Faq } from '@/api/services/faq.service'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { FaqDeleteDialog } from './components/faq-delete-dialog'
import { FaqFormDialog } from './components/faq-form-dialog'
import { FaqsTable } from './components/faqs-table'
import { useFaqsAdmin, useToggleFaqActive } from './data/use-faqs'

const routeApi = getRouteApi('/_authenticated/faqs/')

export function FaqsManagement() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const isActiveParam =
    search.isActive === 'true'
      ? true
      : search.isActive === 'false'
        ? false
        : undefined

  const listParams = {
    search: (search.search as string)?.trim() || undefined,
    isActive: isActiveParam,
  }

  const { data: allRows = [], isLoading } = useFaqsAdmin(listParams)
  const { mutate: toggleActive } = useToggleFaqActive()

  const page = (search.page as number) || 1
  const pageSize = (search.pageSize as number) || 10

  const { pageCount, rows } = useMemo(() => {
    const total = allRows.length
    const pc = Math.max(1, Math.ceil(total / pageSize))
    const start = (page - 1) * pageSize
    return {
      pageCount: pc,
      rows: allRows.slice(start, start + pageSize),
    }
  }, [allRows, page, pageSize])

  const [formOpen, setFormOpen] = useState(false)
  const [editing, setEditing] = useState<Faq | null>(null)
  const [deleting, setDeleting] = useState<Faq | null>(null)

  return (
    <RequirePermission resource='faqs' action='read'>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              FAQs Management
            </h2>
            <p className='text-muted-foreground'>
              Frequently asked questions displayed on the landing page (when displaying).
            </p>
          </div>
          <Can I='faqs:create'>
            <Button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
              Add FAQ
            </Button>
          </Can>
        </div>

        <FaqsTable
          data={rows}
          pageCount={pageCount}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
          onEdit={(faq) => {
            setEditing(faq)
            setFormOpen(true)
          }}
          onDelete={setDeleting}
          onToggleActive={(faq) => toggleActive(faq.id)}
        />
      </Main>

      <FaqFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        faq={editing}
      />

      <FaqDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        faq={deleting}
      />
    </RequirePermission>
  )
}
