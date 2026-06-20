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
      toast.success('Đã tạo chuyên khoa thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể tạo chuyên khoa')
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
      toast.success('Đã cập nhật chuyên khoa thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật chuyên khoa')
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
      toast.success('Đã xóa chuyên khoa thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể xóa chuyên khoa')
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
      toast.success('Đã tạo mục thông tin thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể tạo mục thông tin')
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
      toast.success('Đã cập nhật mục thông tin thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể cập nhật mục thông tin')
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
      toast.success('Đã xóa mục thông tin thành công')
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Không thể xóa mục thông tin')
    },
  })
}
