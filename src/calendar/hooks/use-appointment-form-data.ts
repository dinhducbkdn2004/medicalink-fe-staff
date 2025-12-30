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

const canAllowPastDates = (): boolean => {
  const user = useAuthStore.getState().user
  if (!user) return false
  return user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
}

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
const CACHE_DURATION = 10 * 60 * 1000

let initialPatientsCache: { data: Patient[]; timestamp: number } | null = null
let isFetchingPatients = false

export function usePatients(search?: string) {
  const [patients, setPatients] = useState<Patient[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const fetchPatients = async (searchTerm: string) => {
      if (
        !searchTerm &&
        initialPatientsCache &&
        Date.now() - initialPatientsCache.timestamp < CACHE_DURATION
      ) {
        setPatients(initialPatientsCache.data)
        return
      }

      if (!searchTerm && isFetchingPatients) {
        return
      }

      if (!searchTerm) {
        isFetchingPatients = true
      }

      setIsLoading(true)
      try {
        const params = searchTerm
          ? { page: 1, limit: 20, search: searchTerm }
          : {
              page: 1,
              limit: 10,
              sortBy: 'createdAt',
              sortOrder: 'desc',
              includedDeleted: true,
              search: '',
            }

        const response = await patientService.getPatients(params)

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

    const timeoutId = setTimeout(
      () => {
        fetchPatients(search || '')
      },
      search ? 800 : 0
    )

    return () => clearTimeout(timeoutId)
  }, [search])

  return { patients, isLoading }
}

export function useWorkLocations() {
  const [locations, setLocations] = useState<WorkLocation[]>(() => {
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
      if (
        workLocationsCache &&
        Date.now() - workLocationsCache.timestamp < CACHE_DURATION
      ) {
        setLocations(workLocationsCache.data)
        return
      }

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
  }, [])

  return { locations, isLoading }
}

export function usePublicDoctors() {
  const [doctors, setDoctors] = useState<PublicDoctorProfile[]>(() => {
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
      if (
        publicDoctorsCache &&
        Date.now() - publicDoctorsCache.timestamp < CACHE_DURATION
      ) {
        setDoctors(publicDoctorsCache.data)
        return
      }

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
  }, [])

  return { doctors, isLoading }
}

export function useSpecialties() {
  const [specialties, setSpecialties] = useState<Specialty[]>(() => {
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
      if (
        specialtiesCache &&
        Date.now() - specialtiesCache.timestamp < CACHE_DURATION
      ) {
        setSpecialties(specialtiesCache.data)
        return
      }

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
  }, [])

  return { specialties, isLoading }
}

export function useDoctorsByLocationAndSpecialty(
  locationId?: string,
  specialtyId?: string
) {
  const [doctors, setDoctors] = useState<PublicDoctorProfile[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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

export function useDoctorAvailableDates(
  profileId?: string,
  locationId?: string
) {
  const [availableDates, setAvailableDates] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!profileId || !locationId) {
      setAvailableDates([])
      return
    }

    const fetchAvailableDates = async () => {
      setIsLoading(true)
      try {
        const today = new Date()
        const currentMonth = today.getMonth() + 1
        const currentYear = today.getFullYear()

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

        const results = await Promise.allSettled(
          monthsToFetch.map((period) =>
            doctorProfileService.getDoctorMonthSlots(
              profileId,
              period.month,
              period.year,
              locationId,
              canAllowPastDates()
            )
          )
        )

        const allDates: string[] = []
        results.forEach((result) => {
          if (result.status === 'fulfilled' && result.value.availableDates) {
            allDates.push(...result.value.availableDates)
          }
        })

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

export function useAvailableSlots(
  profileId?: string,
  locationId?: string,
  serviceDate?: Date
) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
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
          canAllowPastDates()
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
