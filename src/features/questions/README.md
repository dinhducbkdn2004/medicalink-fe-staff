# Questions & Answers Feature

## Overview

The Questions & Answers feature provides a community Q&A system where patients can ask medical questions and doctors can provide answers. The system includes moderation features and answer acceptance mechanisms.

## Features

### ✅ Implemented

- **List Questions**: Paginated table view with all questions
- **Filter Questions**: Filter by status (Pending, Approved, Rejected, Answered) and specialty
- **Search**: Search questions by title
- **View Question Details**: View full question with:
  - Question title and body
  - Author information
  - Specialty category
  - Statistics (answers, accepted answers, views)
  - Submission and update dates
- **Manage Answers**: View and manage all answers for a question:
  - Doctor information with avatar
  - Answer content
  - Accept/reject answers
  - Delete inappropriate answers
  - Upvote counts
- **Approve Questions**: Approve pending questions for doctors to answer
- **Reject Questions**: Reject inappropriate or spam questions
- **Delete Questions**: Remove questions from the system
- **Bulk Actions**: Select multiple questions for batch operations

### 📊 Data Display

- **Question Info**: Title, body, author name, specialty
- **Answer Count**: Total and accepted answer counts
- **View Count**: Question view statistics
- **Status**: Color-coded badges (Pending, Approved, Answered, Rejected)

## File Structure

```
src/features/questions/
├── components/
│   ├── data-table-bulk-actions.tsx       # Bulk action buttons
│   ├── data-table-row-actions.tsx        # Row context menu
│   ├── questions-answers-dialog.tsx      # Manage answers dialog
│   ├── questions-approve-dialog.tsx      # Approve question dialog
│   ├── questions-columns.tsx             # Table column definitions
│   ├── questions-delete-dialog.tsx       # Delete confirmation dialog
│   ├── questions-dialogs.tsx             # Dialog container
│   ├── questions-primary-buttons.tsx     # Header action buttons
│   ├── questions-provider.tsx            # Context provider
│   ├── questions-reject-dialog.tsx       # Reject question dialog
│   ├── questions-table.tsx               # Main table component
│   └── questions-view-dialog.tsx         # View details dialog
├── data/
│   ├── data.ts                           # Static data (filter options)
│   ├── schema.ts                         # TypeScript types
│   ├── use-answers.ts                    # Answer React Query hooks
│   └── use-questions.ts                  # Question React Query hooks
├── exports.ts                            # Public exports
├── index.tsx                             # Main page component
└── README.md                             # This file
```

## API Integration

### Question Endpoints

- `GET /api/questions` - List all questions with pagination
- `GET /api/questions/:id` - Get single question details
- `POST /api/questions` - Create new question (public)
- `PATCH /api/questions/:id` - Update question (admin only)
- `DELETE /api/questions/:id` - Delete question (admin only)

### Answer Endpoints

- `GET /api/questions/:id/answers` - Get answers for a question
- `GET /api/questions/answers/:answerId` - Get single answer
- `POST /api/questions/:id/answers` - Create answer (doctor only)
- `PATCH /api/questions/answers/:answerId` - Update answer (admin only)
- `POST /api/questions/answers/:answerId/accept` - Accept answer (admin only)
- `DELETE /api/questions/answers/:answerId` - Delete answer (admin only)

### API Services

- `src/api/services/question.service.ts` - Question operations
- `src/api/services/answer.service.ts` - Answer operations

## Usage

### Basic Usage

```tsx
import { Questions } from '@/features/questions'

function QuestionsPage() {
  return <Questions />
}
```

### Using Question Hooks

```tsx
import {
  useQuestions,
  useQuestion,
  useDeleteQuestion,
  useAnswersForQuestion,
  useAcceptAnswer,
} from '@/features/questions/exports'

function MyComponent() {
  const { data, isLoading } = useQuestions({ page: 1, limit: 10 })
  const { data: answers } = useAnswersForQuestion(questionId)
  const acceptMutation = useAcceptAnswer()

  // Use the data...
}
```

## Components

### QuestionsTable

Main table component that displays questions with filtering and sorting.

**Props:**

- `data`: Array of questions
- `pageCount`: Total number of pages
- `search`: URL search params
- `navigate`: TanStack Router navigate function
- `isLoading`: Loading state

### QuestionsProvider

Context provider for managing dialog state and selected items.

**Context Values:**

- `open`: Record of dialog open states
- `setOpen`: Function to toggle dialogs
- `closeAll`: Function to close all dialogs
- `currentQuestion`: Currently selected question
- `setCurrentQuestion`: Function to set selected question
- `currentAnswer`: Currently selected answer
- `setCurrentAnswer`: Function to set selected answer

### QuestionViewDialog

Displays full question details in a modal.

**Features:**

- Question title and body
- Author and specialty information
- Statistics (answers, views, accepted count)
- Status badge
- Navigate to manage answers

### QuestionAnswersDialog

Manages all answers for a question.

**Features:**

- List all answers with doctor information
- Accept answer functionality
- Delete answer functionality
- Upvote count display
- Real-time data refresh

### QuestionsApproveDialog

Confirmation dialog for approving questions.

**Features:**

- Question preview
- Approve action with loading state
- Toast notifications

### QuestionsRejectDialog

Confirmation dialog for rejecting questions.

**Features:**

- Question preview
- Reject action with loading state
- Toast notifications

### QuestionsDeleteDialog

Confirmation dialog for deleting questions.

**Features:**

- Question preview
- Warning message
- Delete action with loading state
- Toast notifications

## Permissions Required

### Questions

- **Update Questions**: `questions:update` (admin)
- **Delete Questions**: `questions:delete` (admin)

### Answers

- **Create Answers**: `answers:create` (doctor)
- **Update Answers**: `answers:update` (admin)
- **Delete Answers**: `answers:delete` (admin)
- **Manage Answers**: `answers:manage` (admin - for accepting)

### Public Access

- Anyone can view approved questions and accepted answers (no auth required)
- Anyone can submit questions (rate-limited)

## Query Keys

### Questions

- `['questions', 'list', params]` - Paginated list
- `['questions', 'detail', id]` - Single question

### Answers

- `['answers', 'list', questionId, params]` - Answers for question
- `['answers', 'detail', id]` - Single answer

## Workflow

### Question Lifecycle

1. **PENDING**: User submits question → awaiting moderation
2. **APPROVED**: Admin approves → visible to doctors
3. **ANSWERED**: Has at least one accepted answer
4. **REJECTED**: Admin rejects → not visible

### Answer Lifecycle

1. Doctor creates answer → initially unaccepted
2. Admin reviews answer
3. Admin accepts answer → visible to public
4. Or admin deletes inappropriate answer

## Future Enhancements

### 🚧 Not Yet Implemented

- **Edit Questions**: Allow admins to edit question content
- **Question Categories**: Better categorization beyond specialties
- **Answer Voting**: Public voting on answer helpfulness
- **Doctor Notifications**: Notify doctors of new questions in their specialty
- **Question Follow-up**: Allow users to comment on answers
- **Rich Text Editor**: Support for formatted text and images
- **Question Tags**: Additional tagging system
- **Search Enhancement**: Advanced search with filters
- **Email Notifications**: Notify users when their question is answered
- **Anonymous Questions**: Option to ask questions anonymously
- **Export**: Export Q&A to PDF for patient records

## Notes

### Content Moderation

- All questions go through admin moderation
- Spam and inappropriate content should be rejected
- Admins can edit questions if needed
- Only accepted answers are visible to public

### Rate Limiting

- Public question creation: 3 requests per 60 seconds per IP
- Other public endpoints: 100 requests per minute per IP
- Protected endpoints: 200 requests per minute per user

### Best Practices

- Doctors should provide evidence-based answers
- Include disclaimers that answers are for educational purposes
- Encourage users to consult healthcare providers in person
- Monitor for medical misinformation
- Ensure timely responses to approved questions

### Privacy

- Email addresses are stored but not displayed publicly
- Only author name is shown on questions
- Consider HIPAA compliance for sensitive medical information
