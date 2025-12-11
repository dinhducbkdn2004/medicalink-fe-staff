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

/**
 * Get upload signature from backend for secure Cloudinary uploads
 */
export async function getUploadSignature(): Promise<CloudinarySignature> {
  const response = await apiClient.post<CloudinarySignature>(
    '/utilities/upload-signature',
    {}
  )
  return response.data
}

/**
 * Upload image directly to Cloudinary using signature
 * @param file - Image file to upload
 * @returns Uploaded image data including secure_url
 */
export async function uploadToCloudinary(
  file: File
): Promise<CloudinaryUploadResponse> {
  // Get signature from backend
  const signature = await getUploadSignature()

  // Prepare form data for Cloudinary
  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature.signature)
  formData.append('timestamp', signature.timestamp.toString())
  formData.append('api_key', signature.apiKey)
  formData.append('folder', signature.folder)

  // Upload directly to Cloudinary
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
