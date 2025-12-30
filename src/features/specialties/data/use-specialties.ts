import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { specialtyService } from '@/api/services'
import type {
  SpecialtyQueryParams,
  CreateSpecialtyRequest,
  UpdateSpecialtyRequest,
  CreateInfoSectionRequest,
  UpdateInfoSectionRequest,
} from '@/api/services/specialty.service'

export const specialtyKeys = {
  all: ['specialties'] as const,
  lists: () => [...specialtyKeys.all, 'list'] as const,
  list: (params: SpecialtyQueryParams) =>
    [...specialtyKeys.lists(), params] as const,
  details: () => [...specialtyKeys.all, 'detail'] as const,
  detail: (id: string) => [...specialtyKeys.details(), id] as const,
  stats: () => [...specialtyKeys.all, 'stats'] as const,
  infoSections: (specialtyId: string) =>
    [...specialtyKeys.all, 'info-sections', specialtyId] as const,
}

export function useSpecialties(params: SpecialtyQueryParams = {}) {
  return useQuery({
    queryKey: specialtyKeys.list(params),
    queryFn: () => specialtyService.getSpecialties(params),
    staleTime: 1000 * 60 * 5,
  })
}

export function useSpecialty(id: string | undefined) {
  return useQuery({
    queryKey: specialtyKeys.detail(id!),
    queryFn: () => specialtyService.getSpecialty(id!),
    enabled: !!id,
  })
}

export function useSpecialtyStats() {
  return useQuery({
    queryKey: specialtyKeys.stats(),
    queryFn: () => specialtyService.getSpecialtyStats(),
    staleTime: 1000 * 60 * 5,
  })
}

export function useActiveSpecialties() {
  return useQuery({
    queryKey: [...specialtyKeys.all, 'active'],
    queryFn: () => specialtyService.getAllActiveSpecialties(),
    staleTime: 1000 * 60 * 10,
  })
}

export function useInfoSections(specialtyId: string | undefined) {
  return useQuery({
    queryKey: specialtyKeys.infoSections(specialtyId!),
    queryFn: () => specialtyService.getInfoSections(specialtyId!),
    enabled: !!specialtyId,
    staleTime: 1000 * 60 * 5,
  })
}

export function useCreateSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateSpecialtyRequest) =>
      specialtyService.createSpecialty(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create specialty')
    },
  })
}

export function useUpdateSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateSpecialtyRequest }) =>
      specialtyService.updateSpecialty(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.id),
      })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update specialty')
    },
  })
}

export function useDeleteSpecialty() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => specialtyService.deleteSpecialty(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: specialtyKeys.lists() })
      queryClient.invalidateQueries({ queryKey: specialtyKeys.stats() })
      toast.success('Specialty deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete specialty')
    },
  })
}

export function useCreateInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (data: CreateInfoSectionRequest) =>
      specialtyService.createInfoSection(data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section created successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to create info section')
    },
  })
}

export function useUpdateInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: string
      specialtyId: string
      data: UpdateInfoSectionRequest
    }) => specialtyService.updateInfoSection(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section updated successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to update info section')
    },
  })
}

export function useDeleteInfoSection() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id }: { id: string; specialtyId: string }) =>
      specialtyService.deleteInfoSection(id),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.infoSections(variables.specialtyId),
      })
      queryClient.invalidateQueries({
        queryKey: specialtyKeys.detail(variables.specialtyId),
      })
      toast.success('Info section deleted successfully')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Failed to delete info section')
    },
  })
}
