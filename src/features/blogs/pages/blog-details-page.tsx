import { useParams } from '@tanstack/react-router'
import { PageLoader } from '@/components/ui/page-loader'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { BlogForm } from '../components/blog-form'
import { useBlog } from '../data/use-blogs'

export function BlogDetailsPage() {
  
  const { blogId } = useParams({ strict: false })
  const { data: blog, isLoading } = useBlog(blogId)

  if (blogId && isLoading) {
    return <PageLoader />
  }

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center space-x-4'>
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main>
        {}
        <BlogForm initialData={blog?.data || blog} />
      </Main>
    </>
  )
}
