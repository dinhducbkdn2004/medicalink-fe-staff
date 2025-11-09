/**
 * Questions & Answers Management Page
 * Main page for managing questions and answers
 */
import { useMemo } from 'react'
import { useNavigate, useSearch } from '@tanstack/react-router'
import {
  Header,
  HeaderActions,
  HeaderContent,
  Main,
  Search,
} from '@/components/layout'
import { ThemeSwitch } from '@/components/theme-switch'
import { ConfigDrawer } from '@/components/config-drawer'
import { ProfileDropdown } from '@/components/profile-dropdown'
import { useQuestions as useQuestionsData } from './data/use-questions'
import { QuestionsProvider } from './components/questions-provider'
import { QuestionsTable } from './components/questions-table'
import { QuestionsDialogs } from './components/questions-dialogs'
import { QuestionsPrimaryButtons } from './components/questions-primary-buttons'
import type { QuestionQueryParams } from './data/schema'

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
      <Header>
        <HeaderContent>
          <div className='flex w-full items-center justify-between gap-4'>
            <div>
              <h1 className='text-2xl font-bold tracking-tight'>
                Questions & Answers
              </h1>
              <p className='text-muted-foreground'>
                Manage patient questions and doctor answers
              </p>
            </div>

            <HeaderActions>
              <QuestionsPrimaryButtons
                onRefresh={() => refetch()}
                isRefreshing={isFetching}
              />
              <Search />
              <ThemeSwitch />
              <ConfigDrawer />
              <ProfileDropdown />
            </HeaderActions>
          </div>
        </HeaderContent>
      </Header>

      <Main>
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

