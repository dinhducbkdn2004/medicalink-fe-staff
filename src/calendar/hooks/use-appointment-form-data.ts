/**
 * Hooks for appointment form data fetching
 * Correct Flow: Patient → Location → Specialty → Doctor → Date → Time Slots
 */
import { useState, useEffect, useCallback } from 'react'
import { format } from 'date-fns'
import {
  patientService,
  workLocationService,
  specialtyService,
  doctorProfileService,
} from '@/api/services'
import type { TimeSlot } from '@/api/services/doctor-profile.service'
import type { Specialty } from '@/api/services/specialty.service'
import type { WorkLocation } from '@/api/services/work-location.service'
import type { Patient } from '@/api/types'
import type { PublicDoctorProfile } from '@/api/types/doctor.types'

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
    if (search && search.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchPatients(search)
      }, 500)

      return () => clearTimeout(timeoutId)
    } else {
      setPatients([])
    }
  }, [search, searchPatients])

  return { patients, isLoading, searchPatients }
}

// ============================================================================
// Hook: Fetch Public Work Locations (Step 1)
// ============================================================================
export function useWorkLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      setIsLoading(true)
      try {
        const response = await workLocationService.getPublicWorkLocations({
          page: 1,
          limit: 100,
        })
        setLocations(response.data)
      } catch (error) {
        console.error('Failed to fetch work locations:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLocations()
  }, [])

  return { locations, isLoading }
}

// ============================================================================
// Hook: Fetch Public Specialties (Step 2)
// ============================================================================
export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSpecialties = async () => {
      setIsLoading(true)
      try {
        const response = await specialtyService.getPublicSpecialties({
          page: 1,
          limit: 100,
        })
        setSpecialties(response.data)
      } catch (error) {
        console.error('Failed to fetch specialties:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchSpecialties()
  }, [])

  return { specialties, isLoading }
}

// ============================================================================
// Hook: Fetch Doctors by Location AND Specialty (Step 3)
// ============================================================================
export function useDoctorsByLocationAndSpecialty(
  locationId?: string,
  specialtyId?: string
) {
  const [doctors, setDoctors] = useState<PublicDoctorProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Both location and specialty must be selected
    if (!locationId || !specialtyId) {
      setDoctors([])
      return
    }

    const fetchDoctors = async () => {
      setIsLoading(true)
      try {
        const response = await doctorProfileService.getPublicDoctorProfiles({
          page: 1,
          limit: 100,
          workLocationIds: locationId,
          specialtyIds: specialtyId,
        })
        setDoctors(response.data)
      } catch (error) {
        console.error('Failed to fetch doctors:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchDoctors()
  }, [locationId, specialtyId])

  return { doctors, isLoading }
}

// ============================================================================
// Hook: Fetch Available Dates (Step 3.5)
// ============================================================================
export function useDoctorAvailableDates(
  profileId?: string,
  locationId?: string
) {
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // Both profile and location must be selected
    if (!profileId || !locationId) {
      setAvailableDates([])
      return
    }

    const fetchAvailableDates = async () => {
      setIsLoading(true)
      try {
        const dates = await doctorProfileService.getDoctorAvailableDates(
          profileId,
          locationId
        )
        setAvailableDates(dates)
      } catch (error) {
        console.error('Failed to fetch available dates:', error)
        setAvailableDates([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchAvailableDates()
  }, [profileId, locationId])

  return { availableDates, isLoading }
}

// ============================================================================
// Hook: Fetch Available Time Slots (Step 4)
// ============================================================================
export function useAvailableSlots(
  profileId?: string,
  locationId?: string,
  serviceDate?: Date
) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    // All parameters must be provided
    if (!profileId || !locationId || !serviceDate) {
      setSlots([])
      return
    }

    const fetchSlots = async () => {
      setIsLoading(true)
      try {
        const formattedDate = format(serviceDate, 'yyyy-MM-dd')
        const response = await doctorProfileService.getDoctorAvailableSlots(
          profileId,
          locationId,
          formattedDate,
          true // allowPast for staff
        )
        setSlots(response)
      } catch (error) {
        console.error('Failed to fetch available slots:', error)
        setSlots([])
      } finally {
        setIsLoading(false)
      }
    }

    fetchSlots()
  }, [profileId, locationId, serviceDate])

  return { slots, isLoading }
}

// ============================================================================
// DEPRECATED HOOKS (For backward compatibility with reschedule form)
// ============================================================================

/**
 * @deprecated Use useDoctorsByLocationAndSpecialty instead
 * This hook is kept for backward compatibility with the reschedule form
 */
export function useDoctorsBySpecialty(specialtyId?: string) {
  const [doctors, setDoctors] = useState<PublicDoctorProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!specialtyId) {
      setDoctors([])
      return
    }

    const fetchDoctors = async () => {
      setIsLoading(true)
      try {
        const response = await doctorProfileService.getPublicDoctorProfiles({
          page: 1,
          limit: 100,
          specialtyIds: specialtyId,
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

/**
 * @deprecated Use useWorkLocations instead
 * This hook is kept for backward compatibility with the reschedule form
 */
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
        // Return all public work locations
        // In a real scenario, we would filter by doctor's associated locations
        const locationsResponse =
          await workLocationService.getPublicWorkLocations({
            page: 1,
            limit: 100,
          })
        setLocations(locationsResponse.data)
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
