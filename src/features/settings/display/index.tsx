import { ContentSection } from '../components/content-section'
import { DisplayForm } from './display-form'

export function SettingsDisplay() {
  return (
    <ContentSection
      title='Hiển thị'
      desc="Bật hoặc tắt các mục để kiểm soát những gì được hiển thị trong ứng dụng."
    >
      <DisplayForm />
    </ContentSection>
  )
}
