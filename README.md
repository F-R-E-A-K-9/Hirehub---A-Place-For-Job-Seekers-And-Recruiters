# Job Hunt

A full-stack job portal built from scratch with the MERN stack (MongoDB, Express, React, Node). Job seekers can browse and apply to jobs with OTP-verified accounts; recruiters can manage companies, post jobs, and review applicants.

This project was built step by step as a learning exercise — every piece was typed and tested manually to understand how it works, not generated in bulk. It's set up to run on `localhost` only; no deployment config is included.

## Tech stack

**Backend**

- Node.js + Express
- MongoDB + Mongoose
- JWT (httpOnly cookie) for auth
- bcryptjs for password hashing
- Multer + Cloudinary for file uploads (profile photos, company logos)
- Nodemailer (Gmail OAuth2) for OTP emails

**Frontend**

- React + Vite
- Tailwind CSS (custom design system, no component library)
- React Router
- Redux Toolkit + redux-persist
- Axios, Sonner (toasts), Lucide (icons)

## Features

**Auth**

- Register with photo upload → email OTP verification → auto-login
- Login / logout (role-checked: Student vs Recruiter)
- Forgot password / reset password (OTP-based)
- Resend OTP

**Job seeker (Student)**

- Browse and search jobs (keyword search on title/description)
- View job details
- Apply to a job (once per job)
- Edit profile (bio, skills, resume link)
- View applied jobs and their status (pending / accepted / rejected)

**Recruiter**

- Create and edit a company profile (logo, description, website, location)
- Post a job under a company
- View own posted jobs
- View applicants per job, with resume link
- Accept / reject applicants

**Not included**

- AI-based job recommendations — intentionally skipped as an optional add-on. The rest of the app does not depend on it.

## Design system

The frontend uses a custom, minimal design language instead of a component library like shadcn:

| Token    | Value     | Use                                                |
| -------- | --------- | -------------------------------------------------- |
| `paper`  | `#F6F5F1` | Page background                                    |
| `ink`    | `#16202A` | Primary text, primary buttons                      |
| `slate`  | `#5C6570` | Secondary text                                     |
| `line`   | `#DDD9D0` | Hairline borders/dividers                          |
| `signal` | `#0F6E56` | Accent — primary actions, links, "accepted" status |
| `flag`   | `#B5602C` | Rare accent — "rejected" status only               |

Fonts: **Space Grotesk** (headings) + **IBM Plex Sans** (body/UI). Job listings use hairline-divided rows rather than shadowed cards.

## Project structure

```
Job-Portal/
├── Backend/
│   ├── controllers/       # user, job, company, application
│   ├── models/             # User, Job, Company, Application (Mongoose schemas)
│   ├── routes/              # one router per resource
│   ├── middleware/       # isAuthenticated (JWT check), multer (file upload)
│   ├── utils/                # db connect, cloudinary, datauri, mailer
│   ├── .env
│   └── index.js
└── Frontend/
    ├── src/
    │   ├── components/
    │   │   ├── auth/        # Login, Register
    │   │   ├── layout/      # Navbar, Layout
    │   │   ├── jobs/        # JobCard, EditProfileModal
    │   │   └── admin/        # AdminNav, ProtectedRoute, Companies,
    │   │                     # CompanyCreate, CompanySetup, PostJob,
    │   │                     # AdminJobs, Applicants
    │   ├── pages/             # Home, Jobs, Description, Profile,
    │   │                     # VerifyOtp, ForgotPassword
    │   ├── redux/            # authSlice, jobSlice, companySlice,
    │   │                     # applicationSlice, customStorage, store
    │   ├── hooks/             # useGetAllJobs, useGetSingleJob,
    │   │                     # useGetAppliedJobs, useGetAllCompanies,
    │   │                     # useGetCompanyById, useGetAllAdminJobs,
    │   │                     # useGetApplicants
    │   ├── utils/data.js  # API endpoint constants
    │   ├── App.jsx           # routes
    │   └── main.jsx
    └── index.html
```

## Environment variables (Backend `.env`)

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=some_long_random_string
PORT=5011
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173

CLOUD_NAME=your_cloudinary_cloud_name
CLOUD_API=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret

EMAIL_USER=your_gmail_address@gmail.com
CLIENT_ID=your_google_oauth_client_id
CLIENT_SECRET=your_google_oauth_client_secret
REFRESH_TOKEN=your_google_oauth_refresh_token
```

There is no `.env` file for the frontend — the API base URLs are hardcoded in `src/utils/data.js` pointing at `http://localhost:5011`, since this project only runs locally.

## Running it locally

Two terminals, both servers running at the same time.

**Backend**

```bash
cd Backend
npm install
npm run dev
```

Runs on `http://localhost:5011`. Console should show `Server is running on port 5011` and `MongoDB Connected...`.

**Frontend**

```bash
cd Frontend
npm install
npm run dev
```

Runs on `http://localhost:5173`.

## Manual test flow

A full pass to confirm everything is wired up correctly:

1. Register a **Student** account with a profile photo → check email for OTP → verify → should auto-login.
2. Register a **Recruiter** account the same way, in a second browser tab or after logging out.
3. As the Recruiter: create a company → fill in its details/logo → post a job under it.
4. As the Student: search for the job on `/jobs`, open it, apply.
5. As the Recruiter: go to **My jobs → View applicants**, see the student's application, click **Accept**.
6. As the Student: check `/profile` → the applied job's status should now show **accepted**.
7. Try **Forgot password** from the login page and confirm you can log in with the new password.

## Known quirks (Windows-specific)

Windows' filesystem is case-insensitive, which occasionally caused import errors during development (e.g. `Login.jsx` vs `login.jsx` being treated as the same file by Windows but as different files by the TypeScript/Vite tooling). If a "differs only in casing" error ever reappears:

1. Rename the file in two steps (e.g. `Login.jsx` → `Login_temp.jsx` → `Login.jsx`) to force Windows to update the casing on disk.
2. Run **TypeScript: Restart TS Server** from the VS Code command palette.

## Not implemented / deliberately skipped

- AI job recommendations (backend endpoint and frontend component were skipped by design)
- Deployment configuration (this project is local-only)
- Automated tests
