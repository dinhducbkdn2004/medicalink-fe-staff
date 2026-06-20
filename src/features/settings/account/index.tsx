import { ContentSection } from '../components/content-section'
import { ChangePasswordSection } from './change-password-section'

export function SettingsAccount() {
  return (
    <ContentSection
      title='Tài khoản'
      desc='Quản lý cài đặt tài khoản và thay đổi mật khẩu của bạn.'
    >
        <ChangePasswordSection />
    </ContentSection>
  )
}
