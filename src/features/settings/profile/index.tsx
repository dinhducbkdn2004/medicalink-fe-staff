import { Separator } from '@/components/ui/separator'
import { AccountForm } from '../account/account-form'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Hồ sơ'
      desc='Xem thông tin tài khoản và vai trò của bạn trong hệ thống.'
    >
      <div className='space-y-6'>
        <AccountForm />
        <Separator />
        <ProfileForm />
      </div>
    </ContentSection>
  )
}
