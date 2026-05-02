# Last Word API Postman Testing Guide

This file explains how to test all current backend APIs in Postman.

## 1. Prerequisites

1. Start MongoDB and make sure your `.env` values are set.
2. Start backend:

```bash
npm run dev
```

3. Base URL (default):

```text
http://localhost:5000
```

## 2. Postman Setup

1. Create a Postman Environment named `Last Word Local`.
2. Add variable:
   - `baseUrl` = `http://localhost:5000`
3. Enable cookie handling (Postman does this automatically in desktop app).
4. For auth-protected APIs, first call Login or Signup so cookies are stored.

## 3. API List

### Health

#### GET {{baseUrl}}/

Purpose: Check if API is running.

Expected: `200 OK`

---

### Auth APIs

#### POST {{baseUrl}}/api/v1/auth/signup

Purpose: Register a new user and set auth cookies.

Body (JSON):

```json
{
  "name": "Aadarsh",
  "email": "aadarsh@example.com",
  "password": "StrongPass123"
}
```

Expected:
- `201 Created`
- Response has `success: true`
- Cookies set: `accessToken`, `refreshToken`

Common failures:
- `400` invalid fields
- `409` email already exists

#### POST {{baseUrl}}/api/v1/auth/login

Purpose: Login existing user and refresh auth cookies.

Body (JSON):

```json
{
  "email": "aadarsh@example.com",
  "password": "StrongPass123"
}
```

Expected:
- `200 OK`
- Cookies set/updated

Common failures:
- `401` invalid credentials

#### GET {{baseUrl}}/api/v1/auth/me

Purpose: Get current logged-in user.

Headers:
- No manual auth header needed if cookie exists in Postman.

Expected:
- `200 OK` with user object

Common failures:
- `401` if not logged in / token missing

#### POST {{baseUrl}}/api/v1/auth/logout

Purpose: Logout current user and clear auth cookies.

Body: none

Expected:
- `200 OK`
- Cookies cleared

---

### Contacts APIs (Protected)

Important rules:
- Each user can save maximum 3 contacts.
- Contact now requires: `name`, `email`, `number`, `message`, `sendAt`.
- `sendAt` must be a future date-time.

#### POST {{baseUrl}}/api/v1/contacts

Purpose: Create a scheduled contact message.

Body (JSON):

```json
{
  "name": "Rahul",
  "email": "rahul@example.com",
  "number": "+919876543210",
  "message": "If I do not respond, please check in.",
  "sendAt": "2026-12-31T18:30:00.000Z"
}
```

Expected:
- `201 Created`
- Returns `contact` object
- New contact status is `pending`

Common failures:
- `400` missing/invalid fields
- `400` sendAt is not future date
- `400` max 3 contacts reached
- `409` same number already saved for same user

#### GET {{baseUrl}}/api/v1/contacts

Purpose: List all contacts of logged-in user.

Expected:
- `200 OK`
- Returns `count`, `maxAllowed`, `contacts`

#### POST {{baseUrl}}/api/v1/contacts/send-all

Purpose: Send emails immediately to all saved contacts (do not wait for scheduled time).

Body: none (empty)

Expected:
- `200 OK`
- Returns `successCount`, `failureCount`, and `sendResults` array
- Each contact status updated to `sent` or `failed`
- `sentAt` timestamp recorded

Common failures:
- `400` no contacts saved
- `500` SMTP not configured (if trying to send)

Example response:

```json
{
  "success": true,
  "message": "Messages sent to 3 contact(s)",
  "successCount": 3,
  "failureCount": 0,
  "sendResults": [
    {
      "contactId": "...",
      "contactName": "Aadarsh",
      "email": "aadarsht0001@gmail.com",
      "success": true
    }
  ]
}
```

#### DELETE {{baseUrl}}/api/v1/contacts/:contactId

Purpose: Delete one saved contact.

Example URL:

```text
{{baseUrl}}/api/v1/contacts/6634f2b9e6d3a5d950f1a12c
```

Expected:
- `200 OK` when deleted

Common failures:
- `400` invalid contact id format
- `404` id not found for current user

## 4. Recommended Test Order in Postman

1. `GET /`
2. `POST /api/v1/auth/signup`
3. `GET /api/v1/auth/me`
4. `POST /api/v1/contacts` (create 1st contact)
5. `POST /api/v1/contacts` (create 2nd contact)
6. `POST /api/v1/contacts` (create 3rd contact)
7. `POST /api/v1/contacts` (try 4th, expect 400)
8. `GET /api/v1/contacts` (verify all 3 saved)
9. `POST /api/v1/contacts/send-all` (send emails to all immediately)
10. `GET /api/v1/contacts` (verify status changed to `sent`)
11. `DELETE /api/v1/contacts/:contactId`
12. `POST /api/v1/auth/logout`
13. `GET /api/v1/auth/me` (expect 401)

## 5. Testing Email Delivery

### Option A: Automatic Scheduled Delivery (wait for scheduler)

1. Ensure SMTP values in `.env` are valid (optional for basic testing).
2. Create a contact with `sendAt` 2-3 minutes in future.
3. Wait for scheduler run (checks roughly every 60 seconds).
4. Confirm email received at the contact email.
5. Call `GET /api/v1/contacts` and check status:
   - `sent` if delivered
   - `failed` if delivery error (see `lastError`)

### Option B: Immediate Send (use send-all endpoint)

1. Create 1-3 contacts with any future `sendAt` time.
2. Call `POST /api/v1/contacts/send-all` (no body).
3. Response immediately shows `successCount` and `failureCount`.
4. Check contact statuses changed to `sent` in next `GET /api/v1/contacts` call.

## 6. Optional Postman Tips

1. Save all above requests in one collection: `Last Word API`.
2. Use collection variable `baseUrl` to switch local/staging quickly.
3. In Postman Desktop, keep all auth/contact calls in same collection so cookies persist automatically.
