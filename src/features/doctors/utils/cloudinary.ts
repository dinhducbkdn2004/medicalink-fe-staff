/**
 * Cloudinary Upload Utility
 * Based on /api/utilities/upload-signature specification
 */
import { useState } from 'react'
import { apiClient } from '@/api/core/client'

// ============================================================================
// Types
// ============================================================================

export interface CloudinarySignature {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
  uploadPreset: string
}

export interface CloudinaryUploadResult {
  secure_url: string
  public_id: string
  width: number
  height: number
  format: string
  resource_type: string
  created_at: string
}

export interface UploadError {
  message: string
  code?: string
}

// ============================================================================
// Constants
// ============================================================================

const MAX_IMAGE_SIZE = 10 * 1024 * 1024 // 10MB
const MAX_VIDEO_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
]
const ALLOWED_VIDEO_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime', // .mov
]

// ============================================================================
// Validation
// ============================================================================

export function validateImageFile(file: File): {
  valid: boolean
  error?: string
} {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        'Định dạng ảnh không hợp lệ. Vui lòng upload JPEG, PNG, WebP hoặc GIF.',
    }
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      valid: false,
      error: `Kích thước ảnh vượt quá giới hạn ${MAX_IMAGE_SIZE / 1024 / 1024}MB.`,
    }
  }

  return { valid: true }
}

export function validateVideoFile(file: File): {
  valid: boolean
  error?: string
} {
  if (!ALLOWED_VIDEO_TYPES.includes(file.type)) {
    return {
      valid: false,
      error:
        'Định dạng video không hợp lệ. Vui lòng upload MP4, WebM hoặc MOV.',
    }
  }

  if (file.size > MAX_VIDEO_SIZE) {
    return {
      valid: false,
      error: `Kích thước video vượt quá giới hạn ${MAX_VIDEO_SIZE / 1024 / 1024}MB.`,
    }
  }

  return { valid: true }
}

export function validateMediaFile(file: File): {
  valid: boolean
  error?: string
  type: 'image' | 'video' | 'unknown'
} {
  const isImage = ALLOWED_IMAGE_TYPES.includes(file.type)
  const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type)

  if (isImage) {
    const validation = validateImageFile(file)
    return { ...validation, type: 'image' }
  }

  if (isVideo) {
    const validation = validateVideoFile(file)
    return { ...validation, type: 'video' }
  }

  return {
    valid: false,
    error: 'Định dạng file không được hỗ trợ.',
    type: 'unknown',
  }
}

// ============================================================================
// API Functions
// ============================================================================

/**
 * Request upload signature from backend using API client
 */
export async function getUploadSignature(): Promise<CloudinarySignature> {
  const response = await apiClient.post<CloudinarySignature>(
    '/utilities/upload-signature',
    {}
  )
  return response.data
}

/**
 * Upload file to Cloudinary using signed upload
 * @param resourceType - 'image' or 'video'
 */
export async function uploadToCloudinary(
  file: File,
  signature: CloudinarySignature,
  resourceType: 'image' | 'video' = 'image',
  onProgress?: (progress: number) => void
): Promise<CloudinaryUploadResult> {
  const formData = new FormData()
  formData.append('file', file)
  formData.append('signature', signature.signature)
  formData.append('timestamp', signature.timestamp.toString())
  formData.append('api_key', signature.apiKey)
  formData.append('folder', signature.folder)

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest()

    // Track upload progress
    if (onProgress) {
      xhr.upload.addEventListener('progress', (e) => {
        if (e.lengthComputable) {
          const progress = Math.round((e.loaded / e.total) * 100)
          onProgress(progress)
        }
      })
    }

    xhr.addEventListener('load', () => {
      if (xhr.status === 200) {
        try {
          const result = JSON.parse(xhr.responseText)
          resolve(result)
        } catch (_error) {
          reject(new Error('Failed to parse Cloudinary response'))
        }
      } else {
        try {
          const error = JSON.parse(xhr.responseText)
          reject(new Error(error.error?.message || 'Upload failed'))
        } catch {
          reject(new Error(`Upload failed with status ${xhr.status}`))
        }
      }
    })

    xhr.addEventListener('error', () => {
      reject(new Error('Network error during upload'))
    })

    xhr.addEventListener('abort', () => {
      reject(new Error('Upload aborted'))
    })

    // Use appropriate endpoint based on resource type
    const endpoint = `https://api.cloudinary.com/v1_1/${signature.cloudName}/${resourceType}/upload`
    xhr.open('POST', endpoint)
    xhr.send(formData)
  })
}

/**
 * Complete image upload workflow: validate, get signature, and upload
 * This is a convenience function that combines all steps
 *
 * @param file - The image file to upload
 * @param _accessToken - User's access token (not used, kept for compatibility)
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns The secure URL of the uploaded image
 */
export async function uploadImageToCloudinary(
  file: File,
  _accessToken: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file
  const validation = validateImageFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Get upload signature from backend (uses apiClient with auth)
  const signature = await getUploadSignature()

  // Upload to Cloudinary
  const result = await uploadToCloudinary(file, signature, 'image', onProgress)

  // Return the secure URL
  return result.secure_url
}

/**
 * Complete video upload workflow: validate, get signature, and upload
 *
 * @param file - The video file to upload
 * @param _accessToken - User's access token (not used, kept for compatibility)
 * @param onProgress - Optional callback for upload progress (0-100)
 * @returns The secure URL of the uploaded video
 */
export async function uploadVideoToCloudinary(
  file: File,
  _accessToken: string,
  onProgress?: (progress: number) => void
): Promise<string> {
  // Validate file
  const validation = validateVideoFile(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  // Get upload signature from backend (uses apiClient with auth)
  const signature = await getUploadSignature()

  // Upload to Cloudinary
  const result = await uploadToCloudinary(file, signature, 'video', onProgress)

  // Return the secure URL
  return result.secure_url
}

// ============================================================================
// React Hooks
// ============================================================================

export interface UseCloudinaryUploadResult {
  uploadImage: (
    file: File,
    accessToken: string
  ) => Promise<CloudinaryUploadResult>
  uploading: boolean
  progress: number
  error: UploadError | null
  reset: () => void
}

/**
 * React hook for Cloudinary image uploads with progress tracking
 *
 * @example
 * const { uploadImage, uploading, progress, error } = useCloudinaryUpload();
 *
 * const handleFileChange = async (file: File) => {
 *   try {
 *     const result = await uploadImage(file, accessToken);
 *     console.log('Uploaded:', result.secure_url);
 *   } catch (err) {
 *     console.error('Upload failed:', err);
 *   }
 * };
 */
export function useCloudinaryUpload(): UseCloudinaryUploadResult {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<UploadError | null>(null)

  const uploadImage = async (
    file: File,
    _accessToken: string
  ): Promise<CloudinaryUploadResult> => {
    // Reset state
    setUploading(true)
    setProgress(0)
    setError(null)

    try {
      // Validate file
      const validation = validateImageFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      // Get signature from backend (uses apiClient with auth)
      const signature = await getUploadSignature()

      // Upload to Cloudinary with progress tracking
      const result = await uploadToCloudinary(
        file,
        signature,
        'image',
        setProgress
      )

      setProgress(100)
      return result
    } catch (err) {
      const uploadError: UploadError = {
        message: err instanceof Error ? err.message : 'Upload failed',
      }
      setError(uploadError)
      throw uploadError
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
  }

  return { uploadImage, uploading, progress, error, reset }
}

export interface UseMediaUploadResult {
  uploadMedia: (
    file: File,
    accessToken: string
  ) => Promise<CloudinaryUploadResult>
  uploading: boolean
  progress: number
  error: UploadError | null
  uploadType: 'image' | 'video' | null
  reset: () => void
}

/**
 * React hook for Cloudinary media (image & video) uploads with progress tracking
 *
 * @example
 * const { uploadMedia, uploading, progress, uploadType } = useMediaUpload();
 *
 * const handleFileChange = async (file: File) => {
 *   try {
 *     const result = await uploadMedia(file, accessToken);
 *     console.log('Uploaded:', result.secure_url, 'Type:', uploadType);
 *   } catch (err) {
 *     console.error('Upload failed:', err);
 *   }
 * };
 */
export function useMediaUpload(): UseMediaUploadResult {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<UploadError | null>(null)
  const [uploadType, setUploadType] = useState<'image' | 'video' | null>(null)

  const uploadMedia = async (
    file: File,
    _accessToken: string
  ): Promise<CloudinaryUploadResult> => {
    // Reset state
    setUploading(true)
    setProgress(0)
    setError(null)
    setUploadType(null)

    try {
      // Validate file and determine type
      const validation = validateMediaFile(file)
      if (!validation.valid) {
        throw new Error(validation.error)
      }

      const mediaType = validation.type as 'image' | 'video'
      setUploadType(mediaType)

      // Get signature from backend (uses apiClient with auth)
      const signature = await getUploadSignature()

      // Upload to Cloudinary with progress tracking
      const result = await uploadToCloudinary(
        file,
        signature,
        mediaType,
        setProgress
      )

      setProgress(100)
      return result
    } catch (err) {
      const uploadError: UploadError = {
        message: err instanceof Error ? err.message : 'Upload failed',
      }
      setError(uploadError)
      throw uploadError
    } finally {
      setUploading(false)
    }
  }

  const reset = () => {
    setUploading(false)
    setProgress(0)
    setError(null)
    setUploadType(null)
  }

  return { uploadMedia, uploading, progress, error, uploadType, reset }
}
