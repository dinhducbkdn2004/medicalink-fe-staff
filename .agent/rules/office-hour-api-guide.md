---
trigger: always_on
---

# Office Hours API

Base URL: `/api/office-hours`

## Overview

The Office Hours API manages working hours/schedules for doctors and work
locations. It supports three levels of office hours configuration:

1. **Doctor-specific at a location** - Highest priority
2. **Doctor-specific (all locations)** - Medium priority
3. **Global location hours** - Lowest priority (fallback)

The system uses a priority-based lookup to determine applicable office hours for
a doctor at a specific location.

---

### GET /api/office-hours

**Description:** Get all office hours with filtering.

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:** | Parameter | Type | Required | Default | Description |
|-----------|------|----------|---------|-------------| | `doctorId` | string |
No | - | Filter by doctor CUID | | `workLocationId` | string | No | - | Filter

**Response (200 OK):**
{
    "success": true,
    "message": "Data retrieved successfully",
    "data": {
        "global": [
            {
                "id": "cmi9yqgm70000ry01bb2cijlt",
                "doctorId": null,
                "workLocationId": "cmi5723ip006kqq0167szackc",
                "dayOfWeek": 1,
                "startTime": "08:00",
                "endTime": "17:00",
                "isGlobal": true,
                "createdAt": "2025-11-22T07:23:49.279Z",
                "updatedAt": "2025-11-22T07:23:49.279Z"
            },
            {
                "id": "cmhjitqki0000o401fe5ngkg0",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 0,
                "startTime": "14:00",
                "endTime": "16:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:27.715Z",
                "updatedAt": "2025-11-03T19:16:27.715Z"
            },
            {
                "id": "cmi1jh5hs0000o8013g984fjv",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 1,
                "startTime": "09:00",
                "endTime": "11:30",
                "isGlobal": true,
                "createdAt": "2025-11-16T09:54:31.248Z",
                "updatedAt": "2025-11-16T09:54:31.248Z"
            },
            {
                "id": "cmhjitvi20001o40129j4w2s3",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 1,
                "startTime": "14:00",
                "endTime": "16:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:34.107Z",
                "updatedAt": "2025-11-03T19:16:34.107Z"
            },
            {
                "id": "cmhjiu4q70002o401modhzif2",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 2,
                "startTime": "08:00",
                "endTime": "11:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:46.064Z",
                "updatedAt": "2025-11-03T19:16:46.064Z"
            },
            {
                "id": "cmhjiuw6s0006o4010hpgst81",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 2,
                "startTime": "14:00",
                "endTime": "16:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:17:21.652Z",
                "updatedAt": "2025-11-03T19:17:21.652Z"
            },
            {
                "id": "cmhjiu87w0003o401kgds9t32",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 3,
                "startTime": "08:00",
                "endTime": "11:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:50.588Z",
                "updatedAt": "2025-11-03T19:16:50.588Z"
            },
            {
                "id": "cmhjiv0f10007o401oxyuum1j",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 3,
                "startTime": "14:00",
                "endTime": "16:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:17:27.133Z",
                "updatedAt": "2025-11-03T19:17:27.133Z"
            },
            {
                "id": "cmhjiubxg0004o401dlm9piv7",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 4,
                "startTime": "08:00",
                "endTime": "11:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:55.396Z",
                "updatedAt": "2025-11-03T19:16:55.396Z"
            },
            {
                "id": "cmhjiuff40005o401cs99mmd1",
                "doctorId": null,
                "workLocationId": null,
                "dayOfWeek": 5,
                "startTime": "08:00",
                "endTime": "11:30",
                "isGlobal": true,
                "createdAt": "2025-11-03T19:16:59.920Z",
                "updatedAt": "2025-11-03T19:16:59.920Z"
            }
        ],
        "workLocation": [],
        "doctor": [],
        "doctorInLocation": []
    },
    "timestamp": "2025-11-22T16:13:04.939Z",
    "path": "/api/office-hours",
    "method": "GET",
    "statusCode": 200
}

---

### POST /api/office-hours

**Description:** Create new office hours entry


**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
    "doctorId": "cmi369ceo005ko801r3lfowh4",
    "workLocationId": "cmi5723ip006kqq0167szackc",
    "isGlobal": true,
    "dayOfWeek": 2, // 0-6
    "startTime": "08:00",
    "endTime": "17:00"
}
```

**Field Validations:**

- `doctorId` (optional): Valid CUID - if null, this is a location-only entry
- `workLocationId` (optional): Valid CUID - if null, this is a doctor-only entry
- `dayOfWeek` (required): Integer 0-6 (0 = Sunday, 1 = Monday, ..., 6 =
  Saturday)
- `startTime` (required): Time string in HH:mm format (e.g., "08:00")
- `endTime` (required): Time string in HH:mm format (e.g., "17:00")
- `isGlobal` (optional): Boolean, default false - if true, applies to all
  locations

**Office Hours Types:**

1. **Doctor-specific at location**: Set both `doctorId` and `workLocationId`
2. **Doctor-specific (all locations)**: Set `doctorId` only, `workLocationId` =
   null
3. **Global location hours**: Set `workLocationId` only, `doctorId` = null,
   `isGlobal` = true

**Response (201 Created):**

```json
{
    "success": true,
    "message": "Resource created successfully",
    "data": {
        "id": "cmiahrmya0002ry01uoyzj6oy",
        "doctorId": null,
        "workLocationId": "cmi5723ip006kqq0167szackc",
        "dayOfWeek": 2,
        "startTime": "08:00",
        "endTime": "17:00",
        "isGlobal": true,
        "createdAt": "2025-11-22T16:16:36.850Z",
        "updatedAt": "2025-11-22T16:16:36.850Z"
    },
    "timestamp": "2025-11-22T16:16:37.102Z",
    "path": "/api/office-hours",
    "method": "POST",
    "statusCode": 201
}
```

---


### DELETE /api/office-hours/:id

**Description:** Delete an office hours entry

**Headers:**

```
Authorization: Bearer <access_token>
```

**Path Parameters:**

- `id` (required): Office hours CUID

**Response (200 OK):**

```json
{
    "success": true,
    "message": "Resource deleted successfully",
    "data": {
        "id": "cmiahrmya0002ry01uoyzj6oy",
        "doctorId": null,
        "workLocationId": "cmi5723ip006kqq0167szackc",
        "dayOfWeek": 2,
        "startTime": "08:00",
        "endTime": "17:00",
        "isGlobal": true,
        "createdAt": "2025-11-22T16:16:36.850Z",
        "updatedAt": "2025-11-22T16:16:36.850Z"
    },
    "timestamp": "2025-11-22T16:21:28.803Z",
    "path": "/api/office-hours/cmiahrmya0002ry01uoyzj6oy",
    "method": "DELETE",
    "statusCode": 200
}
```

---

## Day of Week Values

The `dayOfWeek` field uses the following integer values:

- `0` - Sunday
- `1` - Monday
- `2` - Tuesday
- `3` - Wednesday
- `4` - Thursday
- `5` - Friday
- `6` - Saturday

---

## Priority-Based Lookup Logic

When querying office hours with both `doctorId` and `workLocationId`:

1. **First Priority**: Look for office hours where both `doctorId` and
   `workLocationId` match
2. **Second Priority**: If not found, look for office hours with matching
   `doctorId` and `workLocationId = null`
3. **Third Priority**: If not found, look for global office hours with matching
   `workLocationId` and `isGlobal = true`

This allows for:

- Doctor-specific schedules at specific locations (e.g., Dr. Smith works 9-5 at
  Clinic A)
- Doctor-specific default schedules (e.g., Dr. Smith works 8-4 at all other
  locations)
- Location default schedules (e.g., All doctors at Clinic B work 10-6 unless
  specified otherwise)

---

## Use Cases

### Example 1: Create Doctor-Specific Hours at a Location

```json
{
  "doctorId": "cm4doctor123xyz",
  "workLocationId": "cm4location789xyz",
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "17:00",
  "isGlobal": false
}
```

### Example 2: Create Doctor's Default Hours (All Locations)

```json
{
  "doctorId": "cm4doctor123xyz",
  "workLocationId": null,
  "dayOfWeek": 1,
  "startTime": "09:00",
  "endTime": "17:00",
  "isGlobal": false
}
```

### Example 3: Create Global Location Hours

```json
{
  "doctorId": null,
  "workLocationId": "cm4location789xyz",
  "dayOfWeek": 1,
  "startTime": "08:00",
  "endTime": "18:00",
  "isGlobal": true
}
```

---

## Notes

### Time Format

- Times are stored as `DateTime` in the database but only the time portion is
  used
- The date part is always set to `1970-01-01` (epoch date)
- When creating/updating, provide time in `HH:mm` format (24-hour)
- The API will convert to full timestamp format

### Validation Rules

- `startTime` must be before `endTime`
- `dayOfWeek` must be between 0 and 6
- At least one of `doctorId` or `workLocationId` should be set
- Cannot have duplicate entries with same `doctorId`, `workLocationId`, and
  `dayOfWeek`

### Rate Limiting

- Public endpoints: 100 requests per minute per IP
- Protected endpoints: 200 requests per minute per user
