# Work Locations Feature

This feature provides comprehensive management for hospital and clinic work locations.

## Overview

The Work Locations feature allows administrators to:

- View all work locations in a paginated, searchable, and filterable table
- Create new work locations with detailed information
- Edit existing work location details
- Delete work locations (with safety checks for associations)
- Track which doctors are assigned to each location

## Features

### Data Management

- **CRUD Operations**: Full create, read, update, and delete functionality
- **Validation**: Client-side form validation using Zod
- **API Integration**: TanStack Query for efficient data fetching and caching
- **Optimistic Updates**: Instant UI feedback with automatic rollback on errors

### Table Features

- **Pagination**: Configurable page sizes with URL state persistence
- **Search**: Full-text search across location names and addresses
- **Filtering**: Filter by status (Active/Inactive)
- **Sorting**: Sort by name, created date, or updated date
- **Row Selection**: Select multiple rows for bulk operations
- **Row Actions**: Quick access to edit and delete actions

### UI Components

- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile
- **Accessible**: Full keyboard navigation and screen reader support
- **Loading States**: Skeleton loaders and loading indicators
- **Empty States**: Helpful messages when no data is available
- **Error Handling**: User-friendly error messages with toast notifications

## File Structure

```
work-locations/
├── components/
│   ├── data-table-bulk-actions.tsx    # Bulk action toolbar
│   ├── data-table-row-actions.tsx     # Context menu for rows
│   ├── work-locations-action-dialog.tsx   # Create/Edit dialog
│   ├── work-locations-columns.tsx     # Table column definitions
│   ├── work-locations-delete-dialog.tsx   # Delete confirmation
│   ├── work-locations-dialogs.tsx     # Dialog orchestrator
│   ├── work-locations-primary-buttons.tsx # Action buttons
│   ├── work-locations-provider.tsx    # Context provider
│   └── work-locations-table.tsx       # Main table component
├── data/
│   ├── data.ts                        # Static data (filters, options)
│   ├── schema.ts                      # Type definitions
│   └── use-work-locations.ts          # React Query hooks
├── exports.ts                         # Public API exports
├── index.tsx                          # Main page component
└── README.md                          # This file
```

## Usage

### Basic Usage

```tsx
import { WorkLocations } from '@/features/work-locations'

function App() {
  return <WorkLocations />
}
```

### Using Hooks

```tsx
import {
  useWorkLocations,
  useCreateWorkLocation,
} from '@/features/work-locations'

function MyComponent() {
  // Fetch work locations
  const { data, isLoading } = useWorkLocations({
    page: 1,
    limit: 10,
    search: 'hospital',
    isActive: true,
  })

  // Create work location
  const createMutation = useCreateWorkLocation()

  const handleCreate = async () => {
    await createMutation.mutateAsync({
      name: 'New Hospital',
      address: '123 Main St',
      phone: '+1-555-0100',
    })
  }

  return (
    <div>
      {data?.data.map((location) => (
        <div key={location.id}>{location.name}</div>
      ))}
    </div>
  )
}
```

## API Integration

This feature integrates with the Work Locations API:

- `GET /api/work-locations` - List locations with pagination
- `GET /api/work-locations/stats` - Get statistics
- `GET /api/work-locations/:id` - Get single location
- `POST /api/work-locations` - Create location
- `PATCH /api/work-locations/:id` - Update location
- `DELETE /api/work-locations/:id` - Delete location

## Data Validation

### Create/Update Form Fields

- **Name** (required): 2-160 characters
- **Address** (optional): Max 255 characters
- **Phone** (optional): Max 32 characters
- **Timezone** (optional): Max 64 characters (IANA format)
- **Google Maps URL** (optional): Valid URL format

## Permissions

Required permissions:

- `work-locations:read` - View work locations
- `work-locations:update` - Create/update work locations
- `work-locations:delete` - Delete work locations

## Future Enhancements

- [ ] Bulk delete functionality
- [ ] Export to CSV/Excel
- [ ] Advanced filtering (by number of doctors, timezone)
- [ ] Location coordinates for map integration
- [ ] Working hours management
- [ ] Image upload for location photos
- [ ] Integration with doctor schedules

## Contributing

When adding new features:

1. Follow the existing component structure
2. Add proper TypeScript types
3. Include form validation where needed
4. Add loading and error states
5. Update this README with new features
6. Write tests for new functionality

## Related Features

- **Doctors**: Doctors are assigned to work locations
- **Schedules**: Work locations are used in scheduling
- **Appointments**: Patients select work locations for appointments
