import { useState } from 'react'
import { apiClient } from '@/api/core/client'

interface CloudinarySignature {
  signature: string
  timestamp: number
  apiKey: string
  cloudName: string
  folder: string
  uploadPreset: string
}

export const useImageUpload = () => {
  const [isUploading, setIsUploading] = useState(false)

  const uploadImage = async (file: File): Promise<string> => {
    setIsUploading(true)

    try {
      // 1. Get upload signature
      const response = await apiClient.post<CloudinarySignature>(
        '/utilities/upload-signature'
      )
      const { signature, timestamp, apiKey, cloudName, folder, uploadPreset } =
        response.data

      // 2. Prepare FormData
      const formData = new FormData()
      formData.append('file', file)
      formData.append('signature', signature)
      formData.append('timestamp', timestamp.toString())
      formData.append('api_key', apiKey)
      formData.append('folder', folder)
      // Use the upload preset from the backend if provided, otherwise fallback might be needed but backend should match
      if (uploadPreset) {
        formData.append('upload_preset', uploadPreset)
      }

      // 3. Upload to Cloudinary
      // specific endpoint for image upload
      const cloudinaryUrl = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`

      const uploadRes = await fetch(cloudinaryUrl, {
        method: 'POST',
        body: formData,
      })

      if (!uploadRes.ok) {
        const errorData = await uploadRes.json()
        throw new Error(errorData.error?.message || 'Upload failed')
      }

      const result = await uploadRes.json()
      return result.secure_url
    } catch (error) {
      console.error('Upload failed:', error)
      throw error
    } finally {
      setIsUploading(false)
    }
  }

  return { uploadImage, isUploading }
}
