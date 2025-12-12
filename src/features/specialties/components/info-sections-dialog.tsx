import { useState } from 'react'
import { Plus, Edit, Trash2, Loader2 } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer'
import { Separator } from '@/components/ui/separator'
import { type Specialty, type SpecialtyInfoSection } from '../data/schema'
import { useInfoSections } from '../data/use-specialties'
import { InfoSectionDeleteDialog } from './info-section-delete-dialog'
import { InfoSectionForm } from './info-section-form'

interface InfoSectionsDialogProps {
  readonly open: boolean
  readonly onOpenChange: () => void
  readonly specialty: Specialty
}

export function InfoSectionsDialog({
  open,
  onOpenChange,
  specialty,
}: InfoSectionsDialogProps) {
  const [showForm, setShowForm] = useState(false)
  const [editingSection, setEditingSection] =
    useState<SpecialtyInfoSection | null>(null)
  const [deletingSection, setDeletingSection] =
    useState<SpecialtyInfoSection | null>(null)

  const { data: sections, isLoading } = useInfoSections(
    open ? specialty.id : undefined
  )

  const handleAdd = () => {
    setEditingSection(null)
    setShowForm(true)
  }

  const handleEdit = (section: SpecialtyInfoSection) => {
    setEditingSection(section)
    setShowForm(true)
  }

  const handleFormClose = () => {
    setShowForm(false)
    setEditingSection(null)
  }

  return (
    <>
      <Drawer
        direction='right'
        open={open && !showForm}
        dismissible={false}
        onOpenChange={onOpenChange}
      >
        <DrawerContent
          className='h-full w-full sm:max-w-[800px]!'
          onOverlayClick={onOpenChange}
        >
          <DrawerHeader>
            <DrawerTitle className='flex items-center gap-2'>
              Info Sections
              <Badge variant='secondary' className='font-mono'>
                {specialty.name}
              </Badge>
            </DrawerTitle>
            <DrawerDescription>
              Manage information sections for this specialty. These sections
              will be displayed on the specialty detail page.
            </DrawerDescription>
          </DrawerHeader>

          <div className='flex flex-1 flex-col gap-4 overflow-y-auto p-4'>
            <div className='flex items-center justify-between'>
              <p className='text-muted-foreground text-sm'>
                {sections?.length || 0} section
                {sections?.length !== 1 ? 's' : ''}
              </p>
              <Button onClick={handleAdd} size='sm'>
                <Plus className='mr-2 size-4' />
                Add Section
              </Button>
            </div>

            <Separator />

            {isLoading ? (
              <div className='flex h-[300px] items-center justify-center'>
                <Loader2 className='text-muted-foreground size-8 animate-spin' />
              </div>
            ) : !sections || sections.length === 0 ? (
              <div className='flex h-[300px] flex-col items-center justify-center gap-2'>
                <p className='text-muted-foreground text-sm'>
                  No info sections yet
                </p>
                <Button onClick={handleAdd} size='sm' variant='outline'>
                  <Plus className='mr-2 size-4' />
                  Create First Section
                </Button>
              </div>
            ) : (
              <div className='space-y-3'>
                {sections.map((section) => (
                  <Card key={section.id}>
                    <CardHeader className='pb-3'>
                      <div className='flex items-start justify-between gap-2'>
                        <div className='flex-1'>
                          <CardTitle className='text-base'>
                            {section.title}
                          </CardTitle>
                          <CardDescription className='text-xs'>
                            Order: {section.order ?? 'N/A'}
                          </CardDescription>
                        </div>
                        <div className='flex gap-1'>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => handleEdit(section)}
                            className='size-8 p-0'
                          >
                            <Edit className='size-4' />
                            <span className='sr-only'>Edit</span>
                          </Button>
                          <Button
                            size='sm'
                            variant='ghost'
                            onClick={() => setDeletingSection(section)}
                            className='text-destructive hover:text-destructive size-8 p-0'
                          >
                            <Trash2 className='size-4' />
                            <span className='sr-only'>Delete</span>
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    {section.content && (
                      <CardContent className='pt-0'>
                        <div
                          className='text-muted-foreground prose prose-sm line-clamp-3 max-w-none text-sm'
                          dangerouslySetInnerHTML={{ __html: section.content }}
                        />
                      </CardContent>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DrawerContent>
      </Drawer>

      {/* Info Section Form Dialog */}
      {showForm && (
        <InfoSectionForm
          open={showForm}
          onOpenChange={handleFormClose}
          specialty={specialty}
          section={editingSection}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {deletingSection && (
        <InfoSectionDeleteDialog
          open={!!deletingSection}
          onOpenChange={() => setDeletingSection(null)}
          section={deletingSection}
          specialtyId={specialty.id}
        />
      )}
    </>
  )
}
