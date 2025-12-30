
import { WorkLocationsActionDialog } from './work-locations-action-dialog'
import { WorkLocationsDeleteDialog } from './work-locations-delete-dialog'
import { useWorkLocations } from './work-locations-provider'

export function WorkLocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWorkLocations()

  return (
    <>
      {}
      <WorkLocationsActionDialog
        key='work-location-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {}
      {currentRow && (
        <>
          {}
          <WorkLocationsActionDialog
            key={`work-location-edit-${currentRow.id}`}
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
          <WorkLocationsDeleteDialog
            key={`work-location-delete-${currentRow.id}`}
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />
        </>
      )}
    </>
  )
}

