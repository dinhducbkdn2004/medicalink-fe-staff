import { ContentSection } from '../components/content-section'
import { ChangePasswordSection } from './change-password-section'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Account'
      desc='Manage your account settings and change your password.'
    >
        <ChangePasswordSection />
    </ContentSection>
  )
}
