import { ContentSection } from '../components/content-section'
import { AppearanceForm } from './appearance-form'

export function SettingsAppearance() {
  return (
    <ContentSection
      title='Giao diện'
      desc='Tùy chỉnh giao diện của ứng dụng. Tự động chuyển đổi giữa giao diện ngày và đêm.'
    >
      <AppearanceForm />
    </ContentSection>
  )
}
