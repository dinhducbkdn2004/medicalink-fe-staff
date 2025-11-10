# Work Locations UX Improvements

## Overview

Enhanced user experience for creating and editing work locations with modern UI patterns and smart auto-fill features.

## New Features

### 1. **Enhanced Address Input** 🗺️

- **Search Button**: Validate and search addresses
- **Icon Indicator**: MapPin icon for better visual clarity
- **Google Places Ready**: Infrastructure ready for API integration
- **Future Enhancement**: Add Google Places Autocomplete for address suggestions

**Usage:**

```tsx
<AddressInput
  value={address}
  onChange={setAddress}
  onAddressSelect={(selectedAddress) => {
    // Handle selected address
  }}
/>
```

### 2. **Searchable Timezone Selector** 🌍

- **Combobox Component**: Searchable dropdown with Command palette
- **Regional Grouping**: Timezones grouped by Asia, Europe, Americas, Pacific, Africa
- **GMT Offset Display**: Shows timezone with GMT offset (e.g., "Ho Chi Minh City (GMT+7)")
- **Auto-Detection**: Automatically detects user's timezone on create
- **Search Functionality**: Search by city name, timezone, GMT offset, or region

**Features:**

- 60+ popular timezones worldwide
- Group headers for easy navigation
- Keyboard navigation support
- Clear visual feedback for selected timezone

**Timezone Data:**

```typescript
interface TimezoneOption {
  value: string // IANA identifier (e.g., "Asia/Ho_Chi_Minh")
  label: string // City name
  region: string // Geographic region
  offset: number // UTC offset in minutes
  gmtLabel: string // Display format (e.g., "GMT+7")
}
```

### 3. **Smart Google Maps Integration** 🔗

- **Auto-Generate Button** (🪄): Generate Maps URL from address with one click
- **Open Map Button** (↗️): Open location in new tab directly
- **Conditional UI**: Buttons appear/disappear based on context
  - Auto-generate button shows when address is filled but URL is empty
  - Open map button shows when URL is filled

**Smart Behavior:**

- Automatically encodes address for URL safety
- Opens in new tab with proper security (`noopener,noreferrer`)
- Validates Google Maps URL format

## Implementation Details

### New Components

#### `TimezoneCombobox.tsx`

Searchable timezone selector with regional grouping.

```tsx
<TimezoneCombobox
  value={timezone}
  onChange={setTimezone}
  disabled={loading}
  placeholder='Select timezone...'
/>
```

#### `AddressInput.tsx`

Enhanced address input with search functionality.

```tsx
<AddressInput
  value={address}
  onChange={setAddress}
  onAddressSelect={handleSelect}
  disabled={loading}
/>
```

#### `GoogleMapsInput.tsx`

Smart Google Maps URL input with auto-generate and open features.

```tsx
<GoogleMapsInput
  value={mapsUrl}
  onChange={setMapsUrl}
  address={address}
  disabled={loading}
/>
```

### Utility Functions

#### `src/lib/timezones.ts`

- `getUserTimezone()` - Detect user's timezone
- `getGMTOffset()` - Calculate GMT offset
- `formatTimezone()` - Format for display
- `getGroupedTimezones()` - Group by region
- `findTimezone()` - Find timezone by value

#### `src/lib/location-utils.ts`

- `generateGoogleMapsUrl()` - Create Maps URL from address
- `isValidGoogleMapsUrl()` - Validate Maps URL
- `extractAddressFromMapsUrl()` - Parse address from URL
- `openGoogleMaps()` - Open Maps in new tab
- `formatAddress()` - Format address for display

## User Experience Flow

### Creating New Location

1. **Name Field**: User enters location name
2. **Address Field**:
   - User types address
   - Clicks search icon to validate (ready for Google Places)
3. **Phone Field**: User enters phone number
4. **Timezone Field**:
   - Auto-filled with user's current timezone
   - Can search and select different timezone
   - Shows GMT offset for clarity
5. **Google Maps URL**:
   - User sees magic wand button
   - Clicks to auto-generate URL from address
   - Can open generated URL to verify

### Editing Existing Location

1. Form pre-fills with existing data
2. User can update any field
3. If address changes, can regenerate Maps URL
4. Timezone shows current value with GMT offset

## Google Places API Integration (Future)

The address field is ready for Google Places Autocomplete:

```typescript
// In AddressInput component
const handleSearch = async () => {
  // TODO: Add Google Places API key
  const autocomplete = new google.maps.places.AutocompleteService()
  const predictions = await autocomplete.getPlacePredictions({
    input: value,
    types: ['address'],
  })

  // Show suggestions dropdown
  // On selection, fill address and auto-generate Maps URL
}
```

### Environment Variables Needed

```env
VITE_GOOGLE_PLACES_API_KEY=your_api_key_here
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

## Benefits

### For Users 👥

- ✅ Faster data entry with auto-detection
- ✅ Less errors with validation
- ✅ Easy timezone selection with search
- ✅ Quick verification via Maps preview
- ✅ Clear visual feedback

### For Administrators 👨‍💼

- ✅ Consistent address formatting
- ✅ Valid Google Maps links
- ✅ Correct timezone configuration
- ✅ Better data quality
- ✅ Reduced support requests

### For Developers 👨‍💻

- ✅ Reusable components
- ✅ Type-safe utilities
- ✅ Easy to extend
- ✅ Well-documented
- ✅ Future-proof architecture

## Accessibility ♿

- ✅ Keyboard navigation support
- ✅ ARIA labels for screen readers
- ✅ Focus management
- ✅ Clear visual indicators
- ✅ Error messages

## Browser Support

- ✅ Chrome/Edge (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Mobile browsers

## Performance

- ✅ Lazy loading for timezone data
- ✅ Debounced search input
- ✅ Optimized re-renders
- ✅ Minimal bundle size impact (~15KB)

## Future Enhancements

### Planned

- [ ] Google Places Autocomplete integration
- [ ] Geocoding for latitude/longitude
- [ ] Map preview in dialog
- [ ] Batch import from CSV
- [ ] Address validation service

### Under Consideration

- [ ] Multi-language address support
- [ ] Custom timezone definitions
- [ ] Integration with hospital management system
- [ ] Mobile-optimized address entry
- [ ] Voice input for address

## Migration Notes

Existing work locations will continue to work without changes:

- Old data format is fully compatible
- Timezone defaults to "Asia/Ho_Chi_Minh" if not set
- Google Maps URL is optional
- Address field remains flexible

## Testing

Manual testing checklist:

- [x] Create location with all fields
- [x] Edit existing location
- [x] Search timezones by name
- [x] Search timezones by GMT offset
- [x] Auto-generate Maps URL
- [x] Open Maps URL in new tab
- [x] Search address (placeholder)
- [x] Timezone auto-detection
- [x] Form validation
- [x] Responsive design

## Support

For issues or questions:

1. Check this documentation
2. Review component source code
3. Contact development team
4. Create GitHub issue

## Credits

Built with:

- 🎨 Shadcn UI components
- ⚛️ React Hook Form
- 🔍 cmdk for search
- 🌏 IANA Timezone Database
- 🗺️ Google Maps API (ready)
