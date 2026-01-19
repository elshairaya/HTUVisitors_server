# HTU Visiting Management System – Backend

Backend for the HTU Visiting Management System built using Node.js, Express, and PostgreSQL.  
The system manages visitors, staff operations, security check-in/check-out, incidents, and email notifications.

---

## Tech Stack

- Node.js (ES Modules)
- Express.js
- PostgreSQL
- pg (node-postgres)
- dotenv
- cors
- SendGrid API
- Nodemon
- Morgan

---
## Getting Started
```bash
# 1. Install Dependencies
 cd htu-visitors-server
 npm install

# 2. Create PostgeSQL database (e.g., htu_visitors_db)
# 3. Seed database
npm run seed

#4. Start the server
npm run dev
 ```

## Project Structure
```
HTUVisiting-Backend/
│
├── config/
│ └── db.js
│
├── routes/
│ ├── auth.routes.js
│ ├── admin.routes.js
│ ├── staff.routes.js
│ └── security.routes.js
│
├── middleware/
│ ├── auth.middleware.js
│ └── role.middleware.js
│
├── utils/
│ └── overdue.util.js
|
├── seeds/
│ └── seed.js
│
├── server.js
├── .env
├── .env_sample
├── package.json
└── README.md
```
---
## API Endpoints
API Server will start on: http://localhost:3000


---

## API Authentication
**Base URL**:`/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/login` | Login exisitng user|
- POST :`/auth/login`

Example:
```json

{
    "email":"admin@htu.edu",
    "password": "admin123"
}
```
Authentication is handled using request headers: x-user-id

Example:
x-user-id: 2

Roles supported:
- admin
- staff
- security

Unauthorized access returns **403 Forbidden**.

---

## Staff Routes
**Base URL**:`/staff`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/visits`| Create new visitor request|
| GET    | `/visits`| View all visits for logged in staff|
| GET    | `/incidents`| View all visits for logged in staff|
- POST `staff/visits`

Example:
```json
{
  "visitor_name": "Ahmad Ali",
  "visitor_email": "ahmad@example.com",
  "phone": "0790000000",
  "host_name": "Dr. Samer",
  "purpose": "Meeting",
  "expected_check_out": "2026-01-25 14:00"
}
```
- Required Headers:

    x-user-id: [staff id]

---
## Admin Routes
**Base URL**:`/admin`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/users`| Create new user|
| GET    | `/users`| View all users|
| DELETE   | `/user/:id`| Delete user with id|
- POST `admin/users`

Example:
```json
{
  "name": "Ahmad Ali",
  "email": "ahmad@example.com",
  "username": "Ahmad",
  "password": "Ahmad123",
  "role": "admin",
}

```
- DELETE `admin/users/5`

- Required Headers:

    x-user-id: [admin id]
---
## Security Routes
**Base URL**:`/security`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST   | `/validate`| Check access code|
| POST    | `/check-in`| Check in visitor|
| POST   | `/check-out`| Check out visitor|

- POST `security/validate`

Example:
```json
{
  "access_code": "HTU-482193"
}

```
- POST `security/check-in`

Example:
```json
{
  "access_code": "HTU-482193"
}

```
- POST `security/check-out`

Example:
```json
{
  "access_code": "HTU-482193"
}

```
- Required Headers:

    x-user-id: [security id]

---
## Overdue Visits Handling

- Active visits are checked against expected checkout time
- Overdue visits are marked automatically
- Incidents are created only once per visit

Logic implemented in:

utils/overdue.util.js


---

## Email Notifications

When a staff member registers a visit:
- An email is sent to the visitor
- The email contains the access code and visit details  

Email service is implemented using **SendGrid API**.
