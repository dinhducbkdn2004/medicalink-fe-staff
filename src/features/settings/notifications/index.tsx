import { ContentSection } from '../components/content-section'
import { NotificationsForm } from './notifications-form'

export function SettingsNotifications() {
  return (
    <ContentSection
      title='Thông báo'
      desc='Cấu hình cách bạn nhận thông báo.'
    >
      <NotificationsForm />
    </ContentSection>
  )
}
