/**
 * Appointment Hooks
 * React Query hooks for appointment data fetching and mutations
 */
import {
  useQuery,
  useMutation,
  useQueryClient,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query'
import { toast } from 'sonner'
import { appointmentService } from '@/api/services/appointment.service'
import type {
  Appointment,
  AppointmentListParams,
  AppointmentListResponse,
  CreateAppointmentRequest,
  UpdateAppointmentRequest,
  RescheduleAppointmentRequest,
  CancelAppointmentRequest,
  AppointmentActionResponse,
} from '@/api/types/appointment.types'

/**
 * Query key factory for appointments
 */
export const appointmentKeys = {
  all: ['appointments'] as const,
  lists: () => [...appointmentKeys.all, 'list'] as const,
  list: (params?: AppointmentListParams) =>
    [...appointmentKeys.lists(), params] as const,
  detail: (id: string) => [...appointmentKeys.all, 'detail', id] as const,
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

/**
 * Hook to fetch a single appointment by ID
 */
export const useAppointment = (
  id: string,
  options?: {
    enabled?: boolean
  }
): UseQueryResult<Appointment, Error> => {
  return useQuery({
    queryKey: appointmentKeys.detail(id),
    queryFn: () => appointmentService.getById(id),
    enabled: options?.enabled ?? true,
    staleTime: 1000 * 60 * 5, // 5 minutes
  })
}

/**
 * Hook to create a new appointment
 */
export const useCreateAppointment = (): UseMutationResult<
  Appointment,
  Error,
  CreateAppointmentRequest
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateAppointmentRequest) =>
      appointmentService.create(data),
    onSuccess: () => {
      // Invalidate and refetch appointments list
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      toast.success('Appointment created successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to create appointment', {
        description: error.message,
      })
    },
  })
}

/**
 * Hook to update an appointment
 */
export const useUpdateAppointment = (): UseMutationResult<
  Appointment,
  Error,
  { id: string; data: UpdateAppointmentRequest }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: UpdateAppointmentRequest
    }) => appointmentService.update(id, data),
    onSuccess: (_, variables) => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.id),
      })
      toast.success('Appointment updated successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to update appointment', {
        description: error.message,
      })
    },
  })
}

/**
 * Hook to reschedule an appointment
 */
export const useRescheduleAppointment = (): UseMutationResult<
  Appointment,
  Error,
  { id: string; data: RescheduleAppointmentRequest }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data: RescheduleAppointmentRequest
    }) => appointmentService.reschedule(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.id),
      })
      toast.success('Appointment rescheduled successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to reschedule appointment', {
        description: error.message,
      })
    },
  })
}

/**
 * Hook to confirm an appointment
 */
export const useConfirmAppointment = (): UseMutationResult<
  AppointmentActionResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentService.confirm(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) })
      toast.success(data.message || 'Appointment confirmed successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to confirm appointment', {
        description: error.message,
      })
    },
  })
}

/**
 * Hook to complete an appointment
 */
export const useCompleteAppointment = (): UseMutationResult<
  AppointmentActionResponse,
  Error,
  string
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => appointmentService.complete(id),
    onSuccess: (data, id) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({ queryKey: appointmentKeys.detail(id) })
      toast.success(data.message || 'Appointment completed successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to complete appointment', {
        description: error.message,
      })
    },
  })
}

/**
 * Hook to cancel an appointment
 */
export const useCancelAppointment = (): UseMutationResult<
  AppointmentActionResponse,
  Error,
  { id: string; data?: CancelAppointmentRequest }
> => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      data?: CancelAppointmentRequest
    }) => appointmentService.cancel(id, data),
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: appointmentKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: appointmentKeys.detail(variables.id),
      })
      toast.success(data.message || 'Appointment cancelled successfully')
    },
    onError: (error: Error) => {
      toast.error('Failed to cancel appointment', {
        description: error.message,
      })
    },
  })
}
