---
trigger: always_on
---

Appointments API (Staff)
Base URL: /api/appointments

Overview
The Appointments API manages appointment bookings between patients and doctors
for staff members. This documentation endpoints for managing
appointments including creation, updates, rescheduling, confirmation,
completion, and cancellation.

Appointment Endpoints
POST /api/appointments
Description: Create a new appointment.

Headers:

Authorization: Bearer <access_token>
Request Body:

{
    "serviceDate": "2025-11-17",
    "timeStart": "14:30",
    "timeEnd": "15:00",
    "doctorId": "cmi369ceo005ko801r3lfowh4",
    "locationId": "cmhucygcv0004j1bg39hkt5vp",
    "patientId": "cmi59buiy0028my01rgz8ikr9",
    "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
    "reason": "{{$randomLoremParagraph}}",
    "notes": "{{$randomLoremParagraph}}",
    "priceAmount": 200,
    "currency": "USD"
}
Field Validations:

specialtyId (required): Valid CUID
patientId (required): Valid CUID
doctorId (required): Valid CUID
locationId (required): Valid CUID
serviceDate (required): Date string (YYYY-MM-DD)
timeStart (required): Time string (HH:mm)
timeEnd (required): Time string (HH:mm)
reason (optional): String, max 255 characters
notes (optional): Text string
priceAmount (optional): Decimal number
currency (optional): String, max 3 characters (default: "VND")
Response (201 Created):

{
    "success": true,
    "message": "Resource created successfully",
    "data": {
        "id": "cmiag3e1t0005m801rb4ywcq5",
        "patientId": "cmi59buiy0028my01rgz8ikr9",
        "doctorId": "cmi369ceo005ko801r3lfowh4",
        "locationId": "cmhucygcv0004j1bg39hkt5vp",
        "eventId": "cmiag3e1q0003m801bplkn7t5",
        "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
        "status": "BOOKED",
        "reason": "Asperiores nulla consectetur mollitia vel minus optio eligendi voluptate. ",
        "notes": "Et perferendis hic aut. Est beatae reprehenderit beatae nemo. Excepturi animi autem. Asperiores quas aut.",
        "priceAmount": "200",
        "currency": "USD",
        "createdAt": "2025-11-22T15:29:45.953Z",
        "updatedAt": "2025-11-22T15:29:45.953Z",
        "cancelledAt": null,
        "completedAt": null
    },
    "timestamp": "2025-11-22T15:29:46.022Z",
    "path": "/api/appointments",
    "method": "POST",
    "statusCode": 201
}
GET /api/appointments
Description: Get a paginated list of appointments with composite data

Headers:

Authorization: Bearer <access_token>
Query Parameters:

Parameter	Type	Required	Default	Description
page	string	No	1	Page number
limit	string	No	10	Items per page
doctorId	string	No	-	Filter by doctor
workLocationId	string	No	-	Filter by work location
patientId	string	No	-	Filter by patient
fromDate	string	No	-	Filter from date (YYYY-MM-DD)
toDate	string	No	-	Filter to date (YYYY-MM-DD)
status	string	No	-	Filter by status
Response (200 OK):

{
    "success": true,
    "message": "Data retrieved successfully",
    "data": [
        {
            "id": "cmiag3e1t0005m801rb4ywcq5",
            "patientId": "cmi59buiy0028my01rgz8ikr9",
            "doctorId": "cmi369ceo005ko801r3lfowh4",
            "locationId": "cmhucygcv0004j1bg39hkt5vp",
            "eventId": "cmiag3e1q0003m801bplkn7t5",
            "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
            "status": "BOOKED",
            "reason": "Asperiores nulla consectetur mollitia vel minus optio eligendi voluptate. Et distinctio voluptatem ut qui et tempora architecto possimus neque. ",
            "notes": "Et perferendis hic aut. Est beatae reprehenderit beatae nemo. Excepturi animi autem. Asperiores quas aut. Explicabo consectetur voluptatibus ipsa impedit modi voluptatem reprehenderit explicabo. Laudantium vero laudantium voluptatum aut est.",
            "priceAmount": "200",
            "currency": "USD",
            "createdAt": "2025-11-22T15:29:45.953Z",
            "updatedAt": "2025-11-22T15:29:45.953Z",
            "cancelledAt": null,
            "completedAt": null,
            "patient": {
                "fullName": "Patient Phone Hcq9",
                "dateOfBirth": null
            },
            "event": {
                "id": "cmiag3e1q0003m801bplkn7t5",
                "serviceDate": "2025-11-17T00:00:00.000Z",
                "timeStart": "1970-01-01T14:30:00.000Z",
                "timeEnd": "1970-01-01T15:00:00.000Z",
                "nonBlocking": false,
                "eventType": "APPOINTMENT"
            },
            "doctor": {
                "id": "cmi369ceo005ko801r3lfowh4",
                "staffAccountId": "cmi369bx10005tl01nrwr723g",
                "isActive": true,
                "avatarUrl": null,
                "name": "hane"
            }
        }
    ],
    "timestamp": "2025-11-22T15:33:02.028Z",
    "path": "/api/appointments?doctorId=cmi369ceo005ko801r3lfowh4&workLocationId=cmhucygcv0004j1bg39hkt5vp&patientId=cmi59buiy0028my01rgz8ikr9&status=BOOKED&page=1&limit=100&toDate=2025-11-30&fromDate=2025-10-01",
    "method": "GET",
    "statusCode": 200,
    "meta": {
        "page": 1,
        "limit": 100,
        "total": 1,
        "hasNext": false,
        "hasPrev": false,
        "totalPages": 1
    }
}
PATCH /api/appointments/:id
Description: Update an appointment.

Headers:

Authorization: Bearer <access_token>
Path Parameters:

id (required): Appointment CUID
Request Body:

All fields are optional. Only include fields you want to update.

{
    "notes": "123",
    "priceAmount": 99,
    "currency": "VND"
}
Response (200 OK):

{
    "success": true,
    "message": "Resource updated successfully",
    "data": {
        "id": "cmiag3e1t0005m801rb4ywcq5",
        "patientId": "cmi59buiy0028my01rgz8ikr9",
        "doctorId": "cmi369ceo005ko801r3lfowh4",
        "locationId": "cmhucygcv0004j1bg39hkt5vp",
        "eventId": "cmiag3e1q0003m801bplkn7t5",
        "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
        "status": "BOOKED",
        "reason": "Asperiores nulla consectetur mollitia vel minus optio eligendi voluptate. Et distinctio voluptatem ut qui et tempora architecto possimus neque. Dignissimos veniam nesciunt ut hic. Impedit est ab totam accusantium et autem nisi nihil quos.",
        "notes": "123",
        "priceAmount": "99",
        "currency": "VND",
        "createdAt": "2025-11-22T15:29:45.953Z",
        "updatedAt": "2025-11-22T15:33:58.727Z",
        "cancelledAt": null,
        "completedAt": null
    },
    "timestamp": "2025-11-22T15:33:58.760Z",
    "path": "/api/appointments/cmiag3e1t0005m801rb4ywcq5",
    "method": "PATCH",
    "statusCode": 200
}
PATCH /api/appointments/:id/reschedule
Description: Reschedule an appointment to a new time

Headers:

Authorization: Bearer <access_token>
Path Parameters:

id (required): Appointment CUID
**Request Body:**

```json
{
  "doctorId": "cmi369ceo005ko801r3lfowh4",
  "locationId": "cmhucygcv0004j1bg39hkt5vp",
  "serviceDate": "2025-11-17",
  "timeStart": "15:30",
  "timeEnd": "16:00"
}
```

**Field Validations:**

- `doctorId` (optional): Valid CUID
- `locationId` (optional): Valid CUID
- `serviceDate` (optional): Date string (YYYY-MM-DD)
- `timeStart` (optional): Time string (HH:mm)
- `timeEnd` (optional): Time string (HH:mm)

**Response (200 OK):**

```json
{
    "success": true,
    "message": "Resource updated successfully",
    "data": {
        "id": "cmiahfkl4000bm801ysmmm9op",
        "patientId": "cmi59buiy0028my01rgz8ikr9",
        "doctorId": "cmi369ceo005ko801r3lfowh4",
        "locationId": "cmhucygcv0004j1bg39hkt5vp",
        "eventId": "cmiahfkl10009m801rh66ublt",
        "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
        "status": "RESCHEDULED",
        "reason": "Consequatur sed quas amet itaque ab ullam placeat assumenda. Nulla a aliquam in deserunt voluptatibus. Et laudantium omnis quia officia.",
        "notes": "Explicabo officia reprehenderit possimus delectus et hic libero tempore debitis. Sit odit inventore molestiae ipsa. Possimus adipisci nostrum non quasi aliquid.\n      <br/>\n      <p><b>Appointment cancelled by staff</b></p>\n      <p><b>Reason: </b>Hahahahahahahha</p>\n    ",
        "priceAmount": "200",
        "currency": "USD",
        "createdAt": "2025-11-22T16:07:13.912Z",
        "updatedAt": "2025-11-23T03:59:19.845Z",
        "cancelledAt": "2025-11-22T16:08:44.066Z",
        "completedAt": null
    },
    "timestamp": "2025-11-23T03:59:19.850Z",
    "path": "/api/appointments/cmiahfkl4000bm801ysmmm9op/reschedule",
    "method": "PATCH",
    "statusCode": 200
}
PATCH /api/appointments/:id/confirm
Description: Confirm an appointment.

Headers:

Authorization: Bearer <access_token>
Path Parameters:

id (required): Appointment CUID
Response (200 OK):

{
    "success": true,
    "message": "Appointment confirmed successfully",
    "data": {
        "id": "cmiahfkl4000bm801ysmmm9op",
        "patientId": "cmi59buiy0028my01rgz8ikr9",
        "doctorId": "cmi369ceo005ko801r3lfowh4",
        "locationId": "cmhucygcv0004j1bg39hkt5vp",
        "eventId": "cmiahfkl10009m801rh66ublt",
        "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
        "status": "CONFIRMED",
        "reason": "Consequatur sed quas amet itaque ab ullam placeat assumenda. Nulla a aliquam in deserunt voluptatibus. Et laudantium omnis quia officia.",
        "notes": "Explicabo officia reprehenderit possimus delectus et hic libero tempore debitis. Sit odit inventore molestiae ipsa. Possimus adipisci nostrum non quasi aliquid.",
        "priceAmount": "200",
        "currency": "USD",
        "createdAt": "2025-11-22T16:07:13.912Z",
        "updatedAt": "2025-11-22T16:08:10.562Z",
        "cancelledAt": null,
        "completedAt": null
    },
    "timestamp": "2025-11-22T16:08:10.568Z",
    "path": "/api/appointments/cmiahfkl4000bm801ysmmm9op/confirm",
    "method": "PATCH",
    "statusCode": 200
}
PATCH /api/appointments/:id/complete
Description: Mark an appointment as completed.

Headers:

Authorization: Bearer <access_token>
Path Parameters:

id (required): Appointment CUID
Response (200 OK):

{
    "success": true,
    "message": "Appointment completed successfully",
    "data": {
        "id": "cmiag3e1t0005m801rb4ywcq5",
        "patientId": "cmi59buiy0028my01rgz8ikr9",
        "doctorId": "cmi369ceo005ko801r3lfowh4",
        "locationId": "cmhucygcv0004j1bg39hkt5vp",
        "eventId": "cmiag3e1q0003m801bplkn7t5",
        "specialtyId": "cmhucygcv0004j1bg39hkt5vp",
        "status": "COMPLETED",
        "reason": "Asperiores nulla consectetur mollitia vel minus optio eligendi voluptate. Et distinctio voluptatem ut qui et tempora architecto possimus neque. Dignissimos veniam nesciunt ut hic. Impedit est ab totam accusantium et autem nisi nihil quos.",
        "notes": "123",
        "priceAmount": "99",
        "currency": "VND",
        "createdAt": "2025-11-22T15:29:45.953Z",
        "updatedAt": "2025-11-22T15:59:57.544Z",
        "cancelledAt": null,
        "completedAt": "2025-11-22T15:59:57.543Z"
    },
    "timestamp": "2025-11-22T15:59:57.626Z",
    "path": "/api/appointments/cmiag3e1t0005m801rb4ywcq5/complete",
    "method": "PATCH",
    "statusCode": 200
}
DELETE /api/appointments/:id
Description: Cancel an appointment.

Headers:

Authorization: Bearer <access_token>
Path Parameters:

id (required): Appointment CUID
Request Body:

{
  "reason": "Patient requested cancellation due to scheduling conflict"
}
Field Validations:

reason (optional): String explaining the cancellation reason
Response (200 OK):

{
    "success": true,
    "message": "Appointment cancelled successfully",
    "data": {
        "id": "cmiahfkl4000bm801ysmmm9op",
        .....
    },
    "timestamp": "2025-11-22T16:08:44.077Z",
    "path": "/api/appointments/cmiahfkl4000bm801ysmmm9op",
    "method": "DELETE",
    "statusCode": 200
}
