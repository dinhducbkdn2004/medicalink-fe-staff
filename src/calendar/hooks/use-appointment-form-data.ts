/**
 * Hooks for appointment form data fetching
 * Correct Flow: Patient → Location → Specialty → Doctor → Date → Time Slots
 */
import { useState, useEffect } from 'react'
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
import { useAuthStore } from '@/stores/auth-store'

// ============================================================================
// Helper: Check if user can use allowPast
// Only ADMIN and SUPER_ADMIN can select past dates, DOCTOR cannot
// ============================================================================
const canAllowPastDates = (): boolean => {
  const user = useAuthStore.getState().user
  if (!user) return false
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
}

// ============================================================================
// Global Cache for static data to prevent repeated API calls
// ============================================================================
let workLocationsCache: { data: WorkLocation[]; timestamp: number } | null =
  null
let specialtiesCache: { data: Specialty[]; timestamp: number } | null = null
let publicDoctorsCache: {
  data: PublicDoctorProfile[]
  timestamp: number
} | null = null
let isFetchingLocations = false
let isFetchingSpecialties = false
let isFetchingPublicDoctors = false
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

// Cache for initial patients list (empty search)
let initialPatientsCache: { data: Patient[]; timestamp: number } | null = null
let isFetchingPatients = false

// ============================================================================
// Hook: Search Patients
// ============================================================================
export function usePatients(search?: string) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPatients = async (searchTerm: string) => {
      // For empty search, check cache first
      if (
        !searchTerm &&
        initialPatientsCache &&
        Date.now() - initialPatientsCache.timestamp < CACHE_DURATION
      ) {
        setPatients(initialPatientsCache.data)
        return
      }

      // Prevent multiple simultaneous fetches for initial load
      if (!searchTerm && isFetchingPatients) {
        return
      }

      if (!searchTerm) {
        isFetchingPatients = true
      }

      setIsLoading(true)
      try {
        // If no search term, fetch latest 10 patients
        // If search term exists, fetch matched patients
        const params = searchTerm
          ? { page: 1, limit: 20, search: searchTerm }
          : {
              page: 1,
              limit: 10,
              sortBy: 'createdAt',
              sortOrder: 'desc',
              includedDeleted: true,
              search: '', // Explicit empty search
            }

        // @ts-expect-error - params type mismatch for overloading
        const response = await patientService.getPatients(params)

        // Cache initial patients list
        if (!searchTerm) {
          initialPatientsCache = {
            data: response.data,
            timestamp: Date.now(),
          }
        }

        setPatients(response.data)
      } catch (error) {
        console.error('Failed to search patients:', error)
        setPatients([])
      } finally {
        setIsLoading(false)
        if (!searchTerm) {
          isFetchingPatients = false
        }
      }
    }

    // Debounce search - increase delay for user typing
    const timeoutId = setTimeout(
      () => {
        fetchPatients(search || '')
      },
      search ? 800 : 0 // 800ms for search typing, immediate for initial load
    )

    return () => clearTimeout(timeoutId)
  }, [search])

  return { patients, isLoading }
}

// ============================================================================
// Hook: Fetch Public Work Locations (Step 1)
// ============================================================================
export function useWorkLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>(() => {
    // Initialize with cached data if available and fresh
    if (
      workLocationsCache &&
      Date.now() - workLocationsCache.timestamp < CACHE_DURATION
    ) {
      return workLocationsCache.data
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchLocations = async () => {
      // Check cache first
      if (
        workLocationsCache &&
        Date.now() - workLocationsCache.timestamp < CACHE_DURATION
      ) {
        setLocations(workLocationsCache.data)
        return
      }

      // Prevent multiple simultaneous fetches
      if (isFetchingLocations) {
        return
      }

      isFetchingLocations = true
      setIsLoading(true)
      try {
        const response = await workLocationService.getPublicWorkLocations({
          page: 1,
          limit: 100,
        })
        // Update cache
        workLocationsCache = {
          data: response.data,
          timestamp: Date.now(),
        }
        setLocations(response.data)
      } catch (error) {
        console.error('Failed to fetch work locations:', error)
      } finally {
        setIsLoading(false)
        isFetchingLocations = false
      }
    }

    fetchLocations()
  }, []) // Empty deps - only fetch once on mount

  return { locations, isLoading }
}

// ============================================================================
// Hook: Fetch Initial Public Doctors (for "Select Doctor First")
// ============================================================================
export function usePublicDoctors() {
  const [doctors, setDoctors] = useState<PublicDoctorProfile[]>(() => {
    // Initialize with cached data if available and fresh
    if (
      publicDoctorsCache &&
      Date.now() - publicDoctorsCache.timestamp < CACHE_DURATION
    ) {
      return publicDoctorsCache.data
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchDoctors = async () => {
      // Check cache first
      if (
        publicDoctorsCache &&
        Date.now() - publicDoctorsCache.timestamp < CACHE_DURATION
      ) {
        setDoctors(publicDoctorsCache.data)
        return
      }

      // Prevent multiple simultaneous fetches
      if (isFetchingPublicDoctors) {
        return
      }

      isFetchingPublicDoctors = true
      setIsLoading(true)
      try {
        const response = await doctorProfileService.getPublicDoctorProfiles({
          page: 1,
          limit: 20,
          sortBy: 'createdAt',
          sortOrder: 'desc',
        })
        // Update cache
        publicDoctorsCache = {
          data: response.data,
          timestamp: Date.now(),
        }
        setDoctors(response.data)
      } catch (error) {
        console.error('Failed to fetch public doctors:', error)
      } finally {
        setIsLoading(false)
        isFetchingPublicDoctors = false
      }
    }

    fetchDoctors()
  }, []) // Empty deps - only fetch once on mount

  return { doctors, isLoading }
}

// ============================================================================
// Hook: Fetch Public Specialties (Step 2)
// ============================================================================
export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>(() => {
    // Initialize with cached data if available and fresh
    if (
      specialtiesCache &&
      Date.now() - specialtiesCache.timestamp < CACHE_DURATION
    ) {
      return specialtiesCache.data
    }
    return []
  })
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchSpecialties = async () => {
      // Check cache first
      if (
        specialtiesCache &&
        Date.now() - specialtiesCache.timestamp < CACHE_DURATION
      ) {
        setSpecialties(specialtiesCache.data)
        return
      }

      // Prevent multiple simultaneous fetches
      if (isFetchingSpecialties) {
        return
      }

      isFetchingSpecialties = true
      setIsLoading(true)
      try {
        const response = await specialtyService.getPublicSpecialties({
          page: 1,
          limit: 100,
        })
        // Update cache
        specialtiesCache = {
          data: response.data,
          timestamp: Date.now(),
        }
        setSpecialties(response.data)
      } catch (error) {
        console.error('Failed to fetch specialties:', error)
      } finally {
        setIsLoading(false)
        isFetchingSpecialties = false
      }
    }

    fetchSpecialties()
  }, []) // Empty deps - only fetch once on mount

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
// UPDATED: Now uses month-slots API to avoid spamming slots endpoint
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
        // Get current month and next 2 months to provide a good date range
        const today = new Date()
        const currentMonth = today.getMonth() + 1 // JavaScript months are 0-indexed
        const currentYear = today.getFullYear()

        // Fetch available dates for current month and next 2 months
        const monthsToFetch = [
          { month: currentMonth, year: currentYear },
          {
            month: currentMonth === 12 ? 1 : currentMonth + 1,
            year: currentMonth === 12 ? currentYear + 1 : currentYear,
          },
          {
            month: currentMonth >= 11 ? currentMonth - 10 : currentMonth + 2,
            year: currentMonth >= 11 ? currentYear + 1 : currentYear,
          },
        ]

        // Fetch all months in parallel using the new month-slots API
        const results = await Promise.allSettled(
          monthsToFetch.map((period) =>
            doctorProfileService.getDoctorMonthSlots(
              profileId,
              period.month,
              period.year,
              locationId,
              canAllowPastDates() // Only ADMIN/SUPER_ADMIN can see past dates
            )
          )
        )

        // Combine all available dates from all months
        const allDates: string[] = []
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.availableDates) {
            allDates.push(...result.value.availableDates)
          }
        })

        // Sort dates chronologically and remove duplicates
        const uniqueDates = [...new Set(allDates)].sort((a, b) =>
          a.localeCompare(b)
        )
        setAvailableDates(uniqueDates)
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
          canAllowPastDates() // Only ADMIN/SUPER_ADMIN can see past dates
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
