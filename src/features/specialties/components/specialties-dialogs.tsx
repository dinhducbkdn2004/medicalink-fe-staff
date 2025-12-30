
import { SpecialtiesActionDialog } from './specialties-action-dialog'
import { SpecialtiesDeleteDialog } from './specialties-delete-dialog'
import { InfoSectionsDialog } from './info-sections-dialog'
import { useSpecialties } from './specialties-provider'

export function SpecialtiesDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useSpecialties()

  return (
    <>
      {}
      <SpecialtiesActionDialog
        key='specialty-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {}
      {currentRow && (
        <>
          {}
          <SpecialtiesActionDialog
            key={`specialty-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          {}
          <SpecialtiesDeleteDialog
            key={`specialty-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          {}
          <InfoSectionsDialog
            key={`specialty-info-${currentRow.id}`}
            open={open === 'view-info'}
            onOpenChange={() => {
              setOpen('view-info')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            specialty={currentRow}
          />
        </>
      )}
    </>
  )
}

