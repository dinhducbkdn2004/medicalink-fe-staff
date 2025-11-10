/**
 * Questions & Answers Management Page
 * Main page for managing questions and answers
 */
import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import { ConfigDrawer } from '@/components/config-drawer'
import { Header } from '@/components/layout/header'
import { Main } from '@/components/layout/main'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { Search } from '@/components/search'
import { ThemeSwitch } from '@/components/theme-switch'
import { QuestionsDialogs } from './components/questions-dialogs'
import { QuestionsPrimaryButtons } from './components/questions-primary-buttons'
import { QuestionsProvider } from './components/questions-provider'
import { QuestionsTable } from './components/questions-table'
import type { QuestionQueryParams } from './data/schema'
import { useQuestions as useQuestionsData } from './data/use-questions'

// ============================================================================
// Component
// ============================================================================

function QuestionsContent() {
  const navigate = useNavigate()
  const search = useSearch({ from: '/_authenticated/questions/' })

  // Build query params
  const queryParams = useMemo<QuestionQueryParams>(() => {
    const params: QuestionQueryParams = {
      page: search.page || 1,
      limit: search.pageSize || 10,
    }

    if (search.search) params.search = search.search
    if (search.status) params.status = search.status
    if (search.sortBy && search.sortOrder) {
      params.sortBy = search.sortBy
      params.sortOrder = search.sortOrder
    }

    return params
  }, [search])

  // Fetch questions
  const { data, isLoading, refetch, isFetching } = useQuestionsData(queryParams)

  return (
    <>
      <Header fixed>
        <Search />
        <div className='ms-auto flex items-center gap-2'>
          <QuestionsPrimaryButtons
            onRefresh={() => refetch()}
            isRefreshing={isFetching}
          />
          <ThemeSwitch />
          <ConfigDrawer />
          <ProfileDropdown />
        </div>
      </Header>

      <Main className='flex flex-1 flex-col gap-4 sm:gap-6'>
        <div className='flex flex-wrap items-end justify-between gap-2'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Questions & Answers
            </h2>
            <p className='text-muted-foreground'>
              Manage patient questions and doctor answers
            </p>
          </div>
        </div>
        <QuestionsTable
          data={data?.data || []}
          pageCount={data?.meta?.totalPages || 0}
          search={search}
          navigate={navigate}
          isLoading={isLoading}
        />
      </Main>

      <QuestionsDialogs />
    </>
  )
}

// ============================================================================
// Export
// ============================================================================

export function Questions() {
  return (
    <QuestionsProvider>
      <QuestionsContent />
    </QuestionsProvider>
  )
}
