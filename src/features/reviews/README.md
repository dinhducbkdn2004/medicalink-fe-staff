# Reviews Feature

## Overview

The Reviews feature allows administrators to manage patient reviews and ratings for doctors. This feature provides a complete CRUD interface with filtering, sorting, and moderation capabilities.

## Features

### ✅ Implemented

- **List Reviews**: Paginated table view with all reviews
- **Filter Reviews**: Filter by status (Pending, Approved, Rejected) and rating (1-5 stars)
- **Search**: Search reviews by doctor name or patient name
- **View Details**: View full review details including:
  - Doctor information with avatar
  - Patient information
  - Rating with star display
  - Full comment text
  - Helpful count and submission date
- **Approve Reviews**: Approve pending reviews to make them public
- **Delete Reviews**: Remove inappropriate or spam reviews
- **Bulk Actions**: Select multiple reviews for batch operations

### 📊 Data Display

- **Doctor Info**: Avatar, name, and specialty
- **Patient Info**: Name and optional appointment date
- **Rating**: Visual star rating (1-5)
- **Status**: Color-coded badges (Pending, Approved, Rejected)
- **Statistics**: Helpful votes count

## File Structure

```
src/features/reviews/
├── components/
│   ├── data-table-bulk-actions.tsx    # Bulk action buttons
│   ├── data-table-row-actions.tsx     # Row context menu
│   ├── reviews-approve-dialog.tsx     # Approve review dialog
│   ├── reviews-columns.tsx            # Table column definitions
│   ├── reviews-delete-dialog.tsx      # Delete confirmation dialog
│   ├── reviews-dialogs.tsx            # Dialog container
│   ├── reviews-primary-buttons.tsx    # Header action buttons
│   ├── reviews-provider.tsx           # Context provider
│   ├── reviews-table.tsx              # Main table component
│   └── reviews-view-dialog.tsx        # View details dialog
├── data/
│   ├── data.ts                        # Static data (filter options)
│   ├── schema.ts                      # TypeScript types
│   └── use-reviews.ts                 # React Query hooks
├── exports.ts                         # Public exports
├── index.tsx                          # Main page component
└── README.md                          # This file
```

## API Integration

### Endpoints Used

- `GET /api/reviews` - List all reviews with pagination
- `GET /api/reviews/doctors/:doctorId` - Get reviews for specific doctor
- `GET /api/reviews/:id` - Get single review details
- `POST /api/reviews` - Create new review (public)
- `DELETE /api/reviews/:id` - Delete review (admin only)

### API Service

All API calls are handled through `src/api/services/review.service.ts`

## Usage

### Basic Usage

```tsx
import { Reviews } from '@/features/reviews'

function ReviewsPage() {
  return <Reviews />
}
```

### Using Review Hooks

```tsx
import { useReviews, useDeleteReview } from '@/features/reviews/exports'

function MyComponent() {
  const { data, isLoading } = useReviews({ page: 1, limit: 10 })
  const deleteMutation = useDeleteReview()

  // Use the data...
}
```

## Components

### ReviewsTable

Main table component that displays reviews with filtering and sorting.

**Props:**

- `data`: Array of reviews
- `pageCount`: Total number of pages
- `search`: URL search params
- `navigate`: TanStack Router navigate function
- `isLoading`: Loading state

### ReviewsProvider

Context provider for managing dialog state and selected reviews.

**Context Values:**

- `openDialog`: Currently open dialog type
- `setOpen`: Function to toggle dialogs
- `currentReview`: Currently selected review
- `setCurrentReview`: Function to set selected review

### ReviewViewDialog

Displays full review details in a modal.

**Features:**

- Doctor profile with avatar
- Patient information
- Star rating visualization
- Full comment text
- Helpful count
- Submission date

### ReviewApproveDialog

Confirmation dialog for approving reviews.

**Features:**

- Review preview
- Approve action with loading state
- Toast notifications

### ReviewDeleteDialog

Confirmation dialog for deleting reviews.

**Features:**

- Review preview
- Warning message
- Delete action with loading state
- Toast notifications

## Permissions Required

- **Read Reviews**: `reviews:read` (admin)
- **Delete Reviews**: `reviews:delete` (admin)
- **Public Access**: Anyone can view approved reviews (no auth required)

## Query Keys

Review data is cached using these query keys:

- `['reviews', 'list', params]` - Paginated list
- `['reviews', 'detail', id]` - Single review
- `['reviews', 'doctor', doctorId, params]` - Doctor's reviews

## Future Enhancements

### 🚧 Not Yet Implemented

- **Update Review**: Edit review content (waiting for API endpoint)
- **Reject Review**: Mark review as rejected with reason
- **Reply to Reviews**: Doctor responses to reviews
- **Helpful Votes**: Allow users to mark reviews as helpful
- **Image Attachments**: Support for review images
- **Verification Badge**: Verified patient indicator
- **Analytics**: Review statistics and trends
- **Export**: Export reviews to CSV/Excel

## Notes

### Status Workflow

1. **PENDING**: Initial state when review is submitted
2. **APPROVED**: Approved by admin, visible to public
3. **REJECTED**: Rejected by admin, not visible

### Rate Limiting

- Public review creation: 3 requests per 60 seconds per IP
- Other public endpoints: 100 requests per minute per IP
- Protected endpoints: 200 requests per minute per user

### Best Practices

- All reviews go through moderation before being published
- Admins should verify reviews for authenticity
- Inappropriate reviews should be deleted
- Display reviews prominently on doctor profiles
- Monitor for fake or spam reviews
