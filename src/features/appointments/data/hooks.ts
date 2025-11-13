/**
 * Appointment Hooks
 * React Query hooks for appointment data fetching
 */
import { useQuery, type UseQueryResult } from '@tanstack/react-query'
import { appointmentService } from '@/api/services/appointment.service'
import type {
  AppointmentListParams,
  AppointmentListResponse,
} from '@/api/types/appointment.types'

/**
 * Query key factory for appointments
 */
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params?: AppointmentListParams) =>
    [...appointmentKeys.lists(), params] as const,
}

/**
 * Hook to fetch appointments list
 */
export const useAppointments = (
  params?: AppointmentListParams,
  options?: {
    enabled?: boolean
    refetchInterval?: number
  }
): UseQueryResult<AppointmentListResponse, Error> => {
  return useQuery({
    queryKey: appointmentKeys.list(params),
    queryFn: () => appointmentService.getList(params),
    enabled: options?.enabled ?? true,
    refetchInterval: options?.refetchInterval,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}
