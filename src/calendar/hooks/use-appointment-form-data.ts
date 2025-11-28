/**
 * Hooks for appointment form data fetching
 * Flow: Specialty → Doctor → Office Hours → Available slots
 */
import { useState, useEffect, useCallback } from 'react'
import {
  doctorService,
  patientService,
  specialtyService,
  officeHourService,
  type Doctor,
} from '@/api/services'
import type { Specialty } from '@/api/services/specialty.service'
import type { Patient } from '@/api/types'
import type { WorkLocation } from '@/api/types/doctor.types'

// ============================================================================
// Hook: Fetch Specialties
// ============================================================================
export function useSpecialties(search?: string) {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSpecialties = async () => {
      setIsLoading(true)
      try {
        const response = await specialtyService.getSpecialties({
          page: 1,
          limit: 100,
          isActive: true,
          search,
        })
        setSpecialties(response.data)
      } catch (error) {
        console.error('Failed to fetch specialties:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecialties()
  }, [search])

  return { specialties, isLoading }
}

// ============================================================================
// Hook: Fetch Doctors by Specialty
// ============================================================================
export function useDoctorsBySpecialty(specialtyId?: string) {
  const [doctors, setDoctors] = useState<Doctor[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!specialtyId) {
      setDoctors([])
      return
    }

    const fetchDoctors = async () => {
      setIsLoading(true)
      try {
        const response = await doctorService.getDoctors({
          page: 1,
          limit: 100,
          specialtyIds: specialtyId,
          isActive: true,
        })
        setDoctors(response.data)
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [specialtyId])

  return { doctors, isLoading }
}

// ============================================================================
// Hook: Fetch Work Locations by Doctor
// ============================================================================
export function useLocationsByDoctor(doctorId?: string) {
  const [locations, setLocations] = useState<WorkLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!doctorId) {
      setLocations([])
      return
    }

    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        const response = await doctorService.getCompleteDoctorById(doctorId)
        if (response.workLocations) {
          setLocations(response.workLocations)
        } else {
          setLocations([])
        }
      } catch (error) {
        console.error('Failed to fetch locations:', error)
        setLocations([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [doctorId])

  return { locations, isLoading }
}

// ============================================================================
// Hook: Search Patients
// ============================================================================
export function usePatients(search?: string) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const searchPatients = useCallback(async (searchTerm: string) => {
    if (!searchTerm || searchTerm.length < 2) {
      setPatients([])
      return
    }

    setIsLoading(true)
    try {
      const response = await patientService.getPatients({
        page: 1,
        limit: 20,
        search: searchTerm,
      })
      setPatients(response.data)
    } catch (error) {
      console.error('Failed to search patients:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (search) {
      const timeoutId = setTimeout(() => {
        searchPatients(search)
      }, 300)

      return () => clearTimeout(timeoutId)
    } else {
      setPatients([])
    }
  }, [search, searchPatients])

  return { patients, isLoading, searchPatients }
}

// ============================================================================
// Hook: Fetch Office Hours
// ============================================================================
export interface OfficeHour {
  id: string
  doctorId: string
  workLocationId: string
  dayOfWeek: number
  timeStart: string
  timeEnd: string
  isActive: boolean
}

export function useOfficeHours(
  doctorId?: string,
  locationId?: string,
  date?: Date
) {
  const [officeHours, setOfficeHours] = useState<OfficeHour[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // We need at least doctor or location to fetch relevant hours
    if (!doctorId && !locationId) {
      setOfficeHours([])
      return
    }

    const fetchOfficeHours = async () => {
      setIsLoading(true)
      try {
        const response = await officeHourService.getOfficeHours({
          doctorId,
          workLocationId: locationId,
        })

        // Flatten the response to get all relevant hours
        const { global, workLocation, doctor, doctorInLocation } = response.data
        const allHours = [
          ...global,
          ...workLocation,
          ...doctor,
          ...doctorInLocation,
        ]

        // Filter by day of week if date is provided
        if (date) {
          const dayOfWeek = date.getDay()
          const relevantHours = allHours.filter(
            (h) => h.dayOfWeek === dayOfWeek
          )

          setOfficeHours(
            relevantHours.map((h) => ({
              id: h.id,
              doctorId: h.doctorId || '',
              workLocationId: h.workLocationId || '',
              dayOfWeek: h.dayOfWeek,
              timeStart: h.startTime, // Map startTime to timeStart
              timeEnd: h.endTime, // Map endTime to timeEnd
              isActive: true,
            }))
          )
        } else {
          setOfficeHours(
            allHours.map((h) => ({
              id: h.id,
              doctorId: h.doctorId || '',
              workLocationId: h.workLocationId || '',
              dayOfWeek: h.dayOfWeek,
              timeStart: h.startTime,
              timeEnd: h.endTime,
              isActive: true,
            }))
          )
        }
      } catch (error) {
        console.error('Failed to fetch office hours:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchOfficeHours()
  }, [doctorId, locationId, date])

  return { officeHours, isLoading }
}
