/**
 * Work Locations Dialogs
 * Manages all dialogs for the work locations feature
 */
import { WorkLocationsActionDialog } from './work-locations-action-dialog'
import { WorkLocationsDeleteDialog } from './work-locations-delete-dialog'
import { useWorkLocations } from './work-locations-provider'

export function WorkLocationsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useWorkLocations()

  return (
    <>
      {/* Add Work Location Dialog */}
      <WorkLocationsActionDialog
        key='work-location-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {/* Dialogs that require currentRow */}
      {currentRow && (
        <>
          {/* Edit Work Location Dialog */}
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

          {/* Delete Work Location Dialog */}
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

