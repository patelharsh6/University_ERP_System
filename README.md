# University ERP System

A full-stack Enterprise Resource Planning system for universities, built with **Django REST Framework** and **React**. It provides three role-scoped portals — Student, Faculty, and Admin — covering academics, attendance, examinations, fees, and campus communication.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Demo Accounts](#demo-accounts)
- [API Reference](#api-reference)
- [Roles and Permissions](#roles-and-permissions)
- [Project Structure](#project-structure)
- [Testing](#testing)
- [Deployment](#deployment)

---

## Features

### Student Portal (`/s/*`)

| Module | Description |
|---|---|
| **Dashboard** | Attendance percentage, CGPA, outstanding fees, and upcoming deadlines at a glance |
| **Courses** | Enrolled courses with chapter-wise content, progress rings, and an in-page content player |
| **Attendance** | Per-subject attendance breakdown with charts and a date-wise log of every class |
| **Timetable** | Weekly class schedule with room and instructor details |
| **Subjects** | Curriculum for the active semester with credits and electives |
| **Assignments** | Pending, submitted, and graded assignments with file submission |
| **Study Materials** | PDFs, slides, videos, and external links published per course |
| **Assessments** | Consolidated view of quizzes, mid-terms, practicals, and internal marks |
| **Exam Schedules** | Date sheet, venue, seat number, reporting time, and hall-ticket download |
| **Results** | Published semester results with grades, grade points, and SGPA/CGPA |
| **Billing** | Fee structure, payment history, dues, online payment, and receipts |
| **Enrollment** | Semester registration and elective selection |
| **Leave Requests** | Apply for leave and track approval status |
| **Clearance** | Department-wise clearance checklist and status tracking |
| **Counselling** | Book counselling slots, view session history and counsellor notes |
| **Announcements** | University, department, and course announcements with attachments |
| **Notifications** | Personal notification inbox with read/unread state |
| **Messages** | Direct messaging with faculty and administration |
| **Holidays** | Academic calendar with holidays and important dates |
| **Reports** | Downloadable attendance and academic performance reports |
| **Feedback** | Rate courses and instructors across four dimensions, optionally anonymously |
| **Profile & Settings** | Personal details, guardian info, documents, theme, and notification preferences |

### Faculty Portal (`/f/*`)

| Module | Description |
|---|---|
| **Dashboard** | Course load, pending grading, and low-attendance student flags |
| **Course Management** | Create and organise courses, chapters, and content |
| **Attendance Marking** | Select a course and date, then mark a full roster present / absent / late / excused in one save |
| **Grade Entry** | Enter marks per student per exam type; grades and grade points are derived automatically, with a publish toggle |
| **Assignments** | Create assignments, review submissions, and grade with feedback |
| **Study Materials** | Upload and manage course resources |
| **Announcements** | Compose announcements targeted at a course, department, or audience |
| **Feedback** | View aggregated (and anonymised) student feedback |

### Admin Portal (`/a/*`)

| Module | Description |
|---|---|
| **Dashboard** | Headcounts, fee collection, and enrollment trends |
| **Student Management** | Register students, manage profiles, documents, and enrollment status |
| **Faculty Management** | Register faculty, manage departments, designations, and specialisations |
| **Academics** | Subject and course CRUD, semester and department mapping |
| **Fees** | Define fee structures, record payments, and run overdue reports |
| **Announcements** | University-wide announcement management with pinning and priority |
| **Academic Calendar** | Manage holidays, exam schedules, and clearance requirements |

### Cross-cutting

- **JWT authentication** with automatic token refresh and session restore on reload
- **Role-scoped routing and data access** — enforced on both the client and the API
- **Dark mode** and a collapsible sidebar, both persisted to `localStorage`
- **Animated page transitions** via Framer Motion
- **Fully responsive** layout with a mobile drawer navigation
- **Command palette** search in the top navigation

---

## Tech Stack

**Backend**
- Django 5.1 · Django REST Framework 3.15
- SimpleJWT (1h access / 7d refresh, with rotation)
- PostgreSQL (SQLite for local development)
- django-cors-headers · django-filter · drf-spectacular · Pillow

**Frontend**
- React 19 · React Router v7
- Recharts (data visualisation) · Framer Motion (animation) · React Icons (Feather)
- Plain CSS with custom properties — no CSS framework, no CSS-in-JS

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│  React SPA  (localhost:3000)                            │
│                                                         │
│  AuthContext ──► ProtectedRoute ──► Layout              │
│       │                              ├── Sidebar        │
│       │                              ├── TopNavbar      │
│       ▼                              └── Page           │
│  services/api.js                          │             │
│  (Bearer token, 401 → refresh → retry)    │             │
└───────────────────┬─────────────────────────────────────┘
                    │  /api/*   (proxied in dev)
                    ▼
┌─────────────────────────────────────────────────────────┐
│  Django REST API  (localhost:8000)                      │
│                                                         │
│  JWTAuthentication ──► Role permissions ──► get_queryset│
│                                              (scoped)   │
│                                                 │       │
│  accounts · students · faculty · courses               │
│  attendance · fees · results · exams                   │
│  announcements · feedback · campus                     │
└───────────────────┬─────────────────────────────────────┘
                    ▼
              PostgreSQL
```

Every Django app follows the same shape — `models.py`, `serializers.py`, `views.py` (DRF generic class-based views), `urls.py` (explicit `path()` entries), and `admin.py`.

---

## Getting Started

### Prerequisites

- Python 3.12+
- Node.js 18+
- PostgreSQL 14+ (optional locally — SQLite is the default)

### 1. Clone

```bash
git clone https://github.com/patelharsh6/University_ERP_System
cd University_ERP_System
```

### 2. Backend

```bash
cd backend

python -m venv venv
venv\Scripts\activate          # Windows
source venv/bin/activate       # macOS / Linux

pip install -r requirements.txt

cp .env.example .env           # then edit as needed

python manage.py migrate
python manage.py seed_demo     # populates demo users and academic data
python manage.py runserver
```

The API is now at **http://localhost:8000** and the Django admin at **http://localhost:8000/admin/**.

To create your own superuser instead of using the seeded admin:

```bash
python manage.py createsuperuser
```

### 3. Frontend

In a second terminal:

```bash
cd frontend
npm install
npm start
```

The app opens at **http://localhost:3000**. Requests to `/api/*` are proxied to port 8000 in development (configured via `proxy` in `package.json`), so no CORS setup is needed locally.

---

## Environment Variables

Create `backend/.env` from `backend/.env.example`:

```ini
SECRET_KEY=your-secret-key-here
DEBUG=True
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:3000

# Optional — omit to use SQLite
DATABASE_URL=postgres://user:password@localhost:5432/university_erp
```

`.env` is git-ignored. Never commit real credentials.

---

## Demo Accounts

Created by `python manage.py seed_demo`. The command is idempotent and safe to re-run.

| Role | Identifier | Password |
|---|---|---|
| Admin | `admin@university.edu` | `demo1234` |
| Faculty | `EMP001` | `demo1234` |
| Student | `21CS049` | `demo1234` |

Login accepts an **email, enrollment ID, or employee ID** as the identifier.

---

## API Reference

All endpoints are prefixed with `/api/` and require a `Authorization: Bearer <token>` header, except login, registration, and token refresh.

Interactive documentation is served at **`/api/docs/`** (Swagger UI) and the raw schema at **`/api/schema/`**.

### Authentication

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/register/` | Register a user; returns access and refresh tokens |
| `POST` | `/api/auth/login/` | Login with email / enrollment ID / employee ID |
| `POST` | `/api/auth/token/refresh/` | Exchange a refresh token for a new access token |
| `GET` `PATCH` | `/api/auth/profile/` | Read or update the authenticated user's profile |
| `GET` | `/api/auth/users/` | List all users (admin only) |

### Students

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/students/` | List or create student profiles |
| `GET` `PATCH` `DELETE` | `/api/students/<id>/` | Retrieve, update, or remove a student profile |
| `GET` | `/api/students/me/summary/` | Dashboard aggregate for the logged-in student |
| `GET` `POST` | `/api/students/leaves/` | List or submit leave requests |
| `GET` `PATCH` | `/api/students/leaves/<id>/` | Review a leave request (faculty / admin) |

### Faculty

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/faculty/` | List or create faculty profiles |
| `GET` `PATCH` `DELETE` | `/api/faculty/<id>/` | Manage a faculty profile |
| `GET` | `/api/faculty/me/summary/` | Dashboard aggregate for the logged-in faculty member |

### Courses

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/courses/subjects/` | Curriculum subjects |
| `GET` `PATCH` `DELETE` | `/api/courses/subjects/<id>/` | Manage a subject |
| `GET` `POST` | `/api/courses/` | Courses |
| `GET` `PATCH` `DELETE` | `/api/courses/<id>/` | Manage a course |
| `GET` `POST` | `/api/courses/enrollments/` | Student enrollments and progress |
| `GET` `POST` | `/api/courses/assignments/` | Assignments |
| `GET` `PATCH` `DELETE` | `/api/courses/assignments/<id>/` | Manage an assignment |
| `GET` `POST` | `/api/courses/submissions/` | Assignment submissions and grading |
| `GET` `POST` | `/api/courses/materials/` | Study materials (multipart upload) |
| `GET` `PATCH` `DELETE` | `/api/courses/materials/<id>/` | Manage a study material |

### Attendance

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/attendance/` | Attendance records; `POST` accepts a bulk roster |
| `GET` `PATCH` `DELETE` | `/api/attendance/<id>/` | Manage a single record |
| `GET` `POST` | `/api/attendance/timetable/` | Weekly timetable entries |
| `GET` `PATCH` `DELETE` | `/api/attendance/timetable/<id>/` | Manage a timetable entry |

### Examinations and Results

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/results/` | Exam results (students see only published results) |
| `GET` `PATCH` `DELETE` | `/api/results/<id>/` | Manage a result |
| `GET` `POST` | `/api/exams/schedules/` | Exam date sheets, venues, and seat allocation |
| `GET` | `/api/exams/hall-ticket/` | Hall ticket for the logged-in student |

### Fees

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/fees/` | Fee payments |
| `GET` `PATCH` `DELETE` | `/api/fees/<id>/` | Manage a payment |
| `GET` `POST` | `/api/fees/structure/` | Fee structures per course, semester, and year |

### Campus

| Method | Endpoint | Description |
|---|---|---|
| `GET` `POST` | `/api/announcements/` | Announcements, filtered by target audience |
| `GET` `PATCH` `DELETE` | `/api/announcements/<id>/` | Manage an announcement |
| `GET` | `/api/announcements/notifications/` | Personal notification inbox |
| `PATCH` | `/api/announcements/notifications/<id>/` | Mark a notification read |
| `GET` `POST` | `/api/feedback/` | Course and instructor feedback |
| `GET` `POST` | `/api/campus/holidays/` | Academic calendar |
| `GET` `PATCH` | `/api/campus/clearance/` | Department-wise clearance items |
| `GET` `POST` | `/api/campus/counselling/` | Counselling sessions |
| `GET` `POST` | `/api/campus/messages/` | Direct messages |
| `GET` `PATCH` | `/api/campus/preferences/` | User settings and preferences |

### Reporting

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/admin/summary/` | Institution-wide metrics (admin only) |
| `GET` | `/api/reports/attendance/` | Attendance report, filterable by semester and subject |
| `GET` | `/api/reports/performance/` | Academic performance report |

### Common Query Parameters

List endpoints support `?semester=`, `?subject=`, `?course=`, `?status=`, `?date_from=`, `?date_to=`, `?search=`, and `?page=`. Responses are paginated at 20 items per page.

---

## Roles and Permissions

Authorization is enforced on the API, not just in the UI. Every list endpoint scopes its queryset by the requesting user's role.

| | Student | Faculty | Admin |
|---|---|---|---|
| Own profile, attendance, results, fees | Read | Read | Read |
| Other students' records | — | Own courses only | All |
| Mark attendance | — | Own courses | All |
| Enter and publish grades | — | Own courses | All |
| Create courses, subjects, assignments | — | Own courses | All |
| Publish announcements | — | Course / department | University-wide |
| Approve leave requests | — | Yes | Yes |
| Manage users and fee structures | — | — | Yes |

A student's access token cannot retrieve another student's data from any endpoint. This is covered by the test suite.

---

## Project Structure

```
University_ERP_System/
├── backend/
│   ├── erp_backend/          # Settings, root URLconf, WSGI/ASGI
│   ├── core/                 # Shared permissions, pagination, seed_demo command
│   ├── accounts/             # Custom User model (AUTH_USER_MODEL), JWT auth
│   ├── students/             # StudentProfile, LeaveRequest
│   ├── faculty/              # FacultyProfile
│   ├── courses/              # Subject, Course, Enrollment, Assignment,
│   │                         #   AssignmentSubmission, StudyMaterial
│   ├── attendance/           # AttendanceRecord, Timetable
│   ├── exams/                # ExamSchedule, hall tickets
│   ├── results/              # ExamResult
│   ├── fees/                 # FeeStructure, FeePayment
│   ├── announcements/        # Announcement, Notification
│   ├── feedback/             # CourseFeedback
│   ├── campus/               # Holiday, ClearanceItem, CounsellingSession,
│   │                         #   Message, UserPreference
│   ├── manage.py
│   └── requirements.txt
│
└── frontend/
    ├── public/
    └── src/
        ├── index.css         # Design tokens — colors, spacing, radii, shadows,
        │                     #   and the .dark-theme overrides
        ├── App.js            # Route table
        ├── context/          # AuthContext
        ├── services/         # api.js — fetch wrapper with token refresh
        ├── hooks/            # useApi
        ├── components/
        │   ├── Layout/       # Layout, Sidebar, TopNavbar, menuConfig
        │   ├── ui/           # Button, Card, Badge, KPI, Table
        │   ├── common/       # Loading, ErrorState, EmptyState, ProtectedRoute
        │   └── course/       # Course cards, chapters, content player
        └── pages/
            ├── student/
            ├── faculty/
            └── admin/
```

### Styling conventions

All colours, spacing, radii, shadows, and transitions are CSS custom properties defined in `src/index.css`. Dark mode is a `.dark-theme` block that overrides the same variables on the root container. **Always use the tokens** — hardcoded colours break dark mode.

Each component and page has a sibling `.css` file, imported by that file.

---

## Testing

**Backend**

```bash
cd backend
python manage.py test                                    # full suite
python manage.py test students                           # one app
python manage.py test students.tests.LeaveRequestTests.test_student_cannot_self_approve
```

Coverage focuses on authentication flows, role-based queryset scoping, model constraints, and endpoint contracts.

**Frontend**

```bash
cd frontend
npm test                       # watch mode
npm test -- --coverage         # with coverage
npm test -- -t "renders KPI"   # single test by name
```

---

## Deployment

### Build the frontend

```bash
cd frontend
npm run build
```

### Prepare the backend

```bash
cd backend
python manage.py collectstatic --noinput
python manage.py migrate
gunicorn erp_backend.wsgi:application --bind 0.0.0.0:8000
```

### Production checklist

- [ ] `DEBUG=False` and a freshly generated `SECRET_KEY`
- [ ] `ALLOWED_HOSTS` set to your real domain
- [ ] `CORS_ALLOWED_ORIGINS` restricted to the frontend origin
- [ ] PostgreSQL configured via `DATABASE_URL`
- [ ] HTTPS enforced; `SECURE_SSL_REDIRECT`, `SESSION_COOKIE_SECURE`, and `CSRF_COOKIE_SECURE` enabled
- [ ] Media files served from object storage rather than the local disk
- [ ] Static files served by the web server or a CDN
- [ ] Database backups scheduled

---
