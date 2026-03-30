import { useMemo, useState } from 'react'
import { Plus } from 'lucide-react'
import { getRouteApi } from '@tanstack/react-router'
import type { Testimonial } from '@/api/services/testimonial.service'
import { Can } from '@/components/auth/permission-gate'
import { RequirePermission } from '@/components/auth/require-permission'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { Button } from '@/components/ui/button'
import { TestimonialDeleteDialog } from './components/testimonial-delete-dialog'
import { TestimonialFormDialog } from './components/testimonial-form-dialog'
import { TestimonialsTable } from './components/testimonials-table'
import {
  useTestimonialsAdmin,
  useToggleTestimonialFeatured,
} from './data/use-testimonials'

const routeApi = getRouteApi('/_authenticated/testimonials/')

export function TestimonialsManagement() {
  const search = routeApi.useSearch()
  const navigate = routeApi.useNavigate()

  const isFeaturedParam =
    search.isFeatured === 'true'
      ? true
      : search.isFeatured === 'false'
        ? false
        : undefined

  const listParams = {
    search: (search.search as string)?.trim() || undefined,
    isFeatured: isFeaturedParam,
  }

  const { data: allRows = [], isLoading } = useTestimonialsAdmin(listParams)
  const { mutate: toggleFeatured } = useToggleTestimonialFeatured()

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
  const [editing, setEditing] = useState<Testimonial | null>(null)
  const [deleting, setDeleting] = useState<Testimonial | null>(null)

  return (
    <RequirePermission resource='testimonials' action='read'>
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
              Testimonials Management
            </h2>
            <p className='text-muted-foreground'>
              Featured testimonials displayed on the public landing page.
            </p>
          </div>
          <Can I='testimonials:create'>
            <Button
              onClick={() => {
                setEditing(null)
                setFormOpen(true)
              }}
            >
              <Plus className='mr-2 h-4 w-4' />
                Add testimonial
            </Button>
          </Can>
        </div>

        <TestimonialsTable
          data={rows}
          pageCount={pageCount}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
          onEdit={(row) => {
            setEditing(row)
            setFormOpen(true)
          }}
          onDelete={setDeleting}
          onToggleFeatured={(row) => toggleFeatured(row.id)}
        />
      </Main>

      <TestimonialFormDialog
        open={formOpen}
        onOpenChange={(open) => {
          setFormOpen(open)
          if (!open) setEditing(null)
        }}
        testimonial={editing}
      />

      <TestimonialDeleteDialog
        open={!!deleting}
        onOpenChange={(open) => {
          if (!open) setDeleting(null)
        }}
        testimonial={deleting}
      />
    </RequirePermission>
  )
}
