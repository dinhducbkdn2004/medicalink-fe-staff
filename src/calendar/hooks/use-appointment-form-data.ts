/**
 * Hooks for appointment form data fetching
 * Flow: Specialty → Doctor → Office Hours → Available slots
 */
import { useState, useEffect, useCallback } from 'react'
import {
  doctorService,
  workLocationService,
  patientService,
  specialtyService,
  type Doctor,
} from '@/api/services'
import type { Specialty } from '@/api/services/specialty.service'
import type { WorkLocation } from '@/api/services/work-location.service'
import type { Patient } from '@/api/types'

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
        const response = await doctorService.getList({
          page: 1,
          limit: 100,
          specialtyId,
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
        const response = await workLocationService.getList({
          page: 1,
          limit: 100,
          doctorId,
        })
        setLocations(response.data)
      } catch (error) {
        console.error('Failed to fetch locations:', error)
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
    if (!doctorId || !locationId) {
      setOfficeHours([])
      return
    }

    const fetchOfficeHours = async () => {
      setIsLoading(true)
      try {
        // TODO: Implement office hours API call
        // const response = await officeHoursService.getList({
        //   doctorId,
        //   workLocationId: locationId,
        //   dayOfWeek: date?.getDay(),
        // })
        // setOfficeHours(response.data)

        // Mock data for now
        setOfficeHours([])
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
