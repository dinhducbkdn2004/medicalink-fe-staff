import { StaffsActionDialog } from './staffs-action-dialog'
import { StaffsDeleteDialog } from './staffs-delete-dialog'
import { useStaffs } from './staffs-provider'

export function StaffsDialogs() {
  const { open, setOpen, currentRow, setCurrentRow } = useStaffs()
  return (
    <>
      <StaffsActionDialog
        key='staff-add'
        open={open === 'add'}
        onOpenChange={() => setOpen('add')}
      />

      {currentRow && (
        <>
          <StaffsActionDialog
            key={`staff-edit-${currentRow.id}`}
            open={open === 'edit'}
            onOpenChange={() => {
              setOpen('edit')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            currentRow={currentRow}
          />

          <StaffsDeleteDialog
            key={`staff-delete-${currentRow.id}`}
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

