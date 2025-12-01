import { useState, useEffect } from 'react'
import { normalizeAppointment } from '@/calendar/helpers'
import type { IAppointment } from '@/calendar/interfaces'
import { appointmentService } from '@/api/services'
import type { AppointmentListParams } from '@/api/types'

export function useAppointments(params?: AppointmentListParams) {
  const [appointments, setAppointments] = useState<IAppointment[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchAppointments = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await appointmentService.getList(params)
        // Normalize appointments to fix time format
        const normalized = response.data.map(normalizeAppointment)
        setAppointments(normalized)
      } catch (err) {
        setError(err as Error)
        console.error('Failed to fetch appointments:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(params)])

  return { appointments, isLoading, error }
}
