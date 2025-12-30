import { apiClient } from '../core/client'

interface CloudinarySignature {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
  uploadPreset: string
}

interface CloudinaryUploadResponse {
  secure_url: string
  public_id: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export async function getUploadSignature(): Promise<CloudinarySignature> {
  const response = await apiClient.post<CloudinarySignature>(
    '/utilities/upload-signature',
    {}
  )
  return response.data
}

export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResponse> {
  const signature = await getUploadSignature()

  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature.signature)
  formData.append('timestamp', signature.timestamp.toString())
  formData.append('api_key', signature.apiKey)
  formData.append('folder', signature.folder)

  const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${signature.cloudName}/image/upload`
  const response = await fetch(cloudinaryUrl, {
    method: 'POST',
    body: formData,
  })

  if (!response.ok) {
    const error = (await response.json().catch(() => ({}))) as {
      error?: { message?: string }
    }
    throw new Error(
      error.error?.message || 'Failed to upload image to Cloudinary'
    )
  }

  return (await response.json()) as CloudinaryUploadResponse
}

export const cloudinaryService = {
  getUploadSignature,
  uploadToCloudinary,
}
