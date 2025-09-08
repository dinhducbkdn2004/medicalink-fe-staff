export type FunctionComponent = React.ReactElement | null;

// Note: Heroicon types removed as we're using shadcn/ui with Lucide icons instead
// For icon components, use Lucide React icons or shadcn/ui icon components

// Authentication Types
export type StaffRole = 'SUPER_ADMIN' | 'ADMIN' | 'DOCTOR'

export type Gender = 'MALE' | 'FEMALE' | 'UNKNOWN'

export interface StaffAccount {
  id: string
  fullName: string
  email: string
  role: StaffRole
  gender: Gender
  dateOfBirth: string | null
  createdAt: string
  updatedAt: string
}

export interface AuthTokens {
  token: string
  refreshToken: string
  tokenExpires: number
}

export interface LoginResponse {
  data: {
    token: string
    refreshToken: string
    tokenExpires: number
    user: StaffAccount
  }
  message: string
  statusCode: number
  timestamp: string
  path: string
}

export interface ApiResponse<T> {
  data: T
  message: string
  statusCode: number
  timestamp: string
  path: string
}

export interface ApiError {
  message: string
  statusCode: number
  timestamp: string
  path: string
  error?: string
}
