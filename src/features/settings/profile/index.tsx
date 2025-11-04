import { Separator } from '@/components/ui/separator'
import { AccountForm } from '../account/account-form'
import { ContentSection } from '../components/content-section'
import { ProfileForm } from './profile-form'

export function SettingsProfile() {
  return (
    <ContentSection
      title='Profile'
      desc='View your account information and role in the system.'
    >
      <div className='space-y-6'>
        <AccountForm />
        <Separator />
        <ProfileForm />
      </div>
    </ContentSection>
  )
}
