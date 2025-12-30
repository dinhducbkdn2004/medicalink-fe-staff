
import { Eye, Edit, Trash2, Power, Star, BarChart3 } from 'lucide-react'
import type { NavigateFn } from '@/hooks/use-table-url-state'
import {
  DataTable,
  type DataTableAction,
  type ColumnFilterConfig,
} from '@/components/data-table'
import { statusOptions, genderOptions } from '../data/data'
import type { DoctorWithProfile } from '../types'
import {
  canUpdateDoctors,
  canDeleteDoctor,
  canToggleActive,
} from '../utils/permissions'
import { DataTableBulkActions } from './data-table-bulk-actions'
import { doctorsColumns as columns } from './doctors-columns'
import { useDoctors } from './doctors-provider'





type DoctorsTableProps = {
  data: DoctorWithProfile[]
  pageCount?: number
  search: Record<string, unknown>
  navigate: NavigateFn
  isLoading?: boolean
}






const columnFilterConfigs: ColumnFilterConfig[] = [
  {
    columnId: 'fullName',
    searchKey: 'search',
    type: 'string',
  },
  {
    columnId: 'isActive',
    searchKey: 'isActive',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
  {
    columnId: 'isMale',
    searchKey: 'isMale',
    type: 'array',
    serialize: (value: unknown) => (Array.isArray(value) ? value[0] : value),
    deserialize: (value: unknown) => (value ? [value] : []),
  },
]





export function DoctorsTable({
  data,
  pageCount = 0,
  search,
  navigate,
  isLoading = false,
}: DoctorsTableProps) {
  const { setOpen, setCurrentRow } = useDoctors()

  
  const getRowActions = (row: {
    original: DoctorWithProfile
  }): DataTableAction[] => {
    const doctor = row.original

    const actions: DataTableAction[] = [
      {
        label: 'View Reviews',
        icon: Star,
        onClick: () => {
          navigate({
            to: '/doctors/$doctorId/reviews',
            params: { doctorId: doctor.profileId || doctor.id },
          } as never)
        },
      },
      {
        label: 'View Profile',
        icon: Eye,
        onClick: () => {
          navigate({
            to: '/doctors/$doctorId/profile',
            params: { doctorId: doctor.id },
          } as never)
        },
      },
    ]

    
    if (canUpdateDoctors()) {
      actions.push({
        label: 'Edit',
        icon: Edit,
        onClick: () => {
          setCurrentRow(doctor)
          setOpen('edit')
        },
      })
    }

    actions.push({
      label: 'View Stats',
      icon: BarChart3,
      onClick: () => {
        navigate({
          to: '/doctors/$doctorId/stats',
          params: { doctorId: doctor.id },
        } as never)
      },
      separator: true,
    })

    
    if (canToggleActive()) {
      actions.push({
        label: doctor.isActive ? 'Deactivate' : 'Activate',
        icon: Power,
        onClick: () => {
          setCurrentRow(doctor)
          setOpen('toggleActive')
        },
      })
    }

    
    if (canDeleteDoctor(false)) {
      actions.push({
        label: 'Delete',
        icon: Trash2,
        onClick: () => {
          setCurrentRow(doctor)
          setOpen('delete')
        },
        variant: 'destructive',
      })
    }

    return actions
  }

  return (
    <DataTable
      
      data={data}
      columns={columns}
      search={search}
      navigate={navigate}
      
      pageCount={pageCount}
      isLoading={isLoading}
      entityName='doctor'
      
      searchPlaceholder='Search doctors...'
      searchKey='fullName'
      filters={[
        {
          columnId: 'isActive',
          title: 'Status',
          options: statusOptions.map((status) => ({
            label: status.label,
            value: status.value,
            icon: status.icon,
          })),
        },
        {
          columnId: 'isMale',
          title: 'Gender',
          options: genderOptions.map((gender) => ({
            label: gender.label,
            value: gender.value,
            icon: gender.icon,
          })),
        },
      ]}
      
      getRowActions={getRowActions}
      renderBulkActions={(table) => <DataTableBulkActions table={table} />}
      
      enableRowSelection={true}
      columnFilterConfigs={columnFilterConfigs}
      emptyMessage='No doctors found.'
    />
  )
}
