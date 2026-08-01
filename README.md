# MERN Job Board Platform

A complete, production-ready Full-Stack Job Board Platform built with the MERN stack (MongoDB, Express, React, Node.js). This platform connects Job Seekers with Employers, allowing employers to post jobs and seekers to browse and securely apply to them with resume uploads.

---

## 🏗️ Architecture

The application is structured as a **Single Combined Monorepo**. This approach minimizes DevOps complexity by running both the API server and the React SPA on a single Express instance in production.

```mermaid
graph TD
    Client[React SPA (Vite)] --> |HTTP /api/*| Server(Express.js API)
    Server --> |Mongoose| DB[(MongoDB)]
    Server -.-> |File System| Uploads[Local Uploads Dir]
    
    subgraph Development
    ViteServer[Vite Dev Server :5173] --> |Proxy| ServerDev[Express :5000]
    end
    
    subgraph Production
    ServerProd[Express :5000] --> |Serves| Dist[dist/index.html]
    end
```

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v16+)
- MongoDB (Local instance or Atlas URI)

### Local Development

1. **Clone & Install**
   ```bash
   git clone <repo-url>
   cd job-board-platform
   npm install
   ```

2. **Environment Variables**
   Create a `.env` file in the root directory (refer to `.env.example`):
   ```env
   MONGO_URI=mongodb://localhost:27017/jobboard
   JWT_SECRET=your_super_secret_jwt_key
   PORT=5000
   NODE_ENV=development
   ```

3. **Seed the Database (Optional but recommended)**
   ```bash
   npm run seed
   ```
   *Creates demo employer, demo seeker, and 8 sample jobs.*

4. **Run the Application**
   ```bash
   npm run dev
   ```
   *This uses `concurrently` to start Express on port 5000 and Vite on port 5173.*

---

## 🗄️ Database Models

Data is managed via Mongoose with three primary collections:

1. **User**
   - Stores `name`, `email`, `password` (hashed via bcrypt), and `role` (`employer` or `jobseeker`).
2. **Job**
   - Stores `title`, `company`, `location`, `type`, `salary`, `description`, `skills` (Array), and `employer` (ObjectId ref to User).
   - *Index:* Text index on `title`, `company`, and `skills` for optimized search.
3. **Application**
   - Stores `job` (ObjectId), `applicant` (ObjectId), `employer` (ObjectId), `coverLetter`, `resume` (Metadata object), and `status` (`Applied`, `Under Review`, `Shortlisted`, `Rejected`).
   - *Index:* Compound Unique Index on `{ job: 1, applicant: 1 }` prevents duplicate applications.

---

## 🔐 Authentication & Security Decisions

- **Stateless JWT:** Authentication is handled via JSON Web Tokens. Passwords are automatically hashed in a Mongoose `pre('save')` hook using `bcryptjs` (12 salt rounds).
- **Role-Based Authorization:** Custom `protect` and `authorize(...roles)` middlewares enforce strict access control. Seekers cannot create jobs, and Employers cannot apply to jobs.
- **Data Isolation:** Controllers actively enforce ownership constraints (e.g., employers can only edit/delete their own jobs).

---

## 📄 Resume Upload Flow & Security

Resume uploads are processed using `multer`.

1. **Upload Validation:** `multer` ensures only `.pdf`, `.doc`, or `.docx` files are accepted, with a hard limit of `5MB`.
2. **Anonymization:** Files are renamed to a secure UUID format (e.g., `resume_<uuid>.pdf`) and saved to an internal `src/server/uploads` directory.
3. **Secure Access:** The uploads directory is **NOT** exposed publicly. Resumes are fetched via an authenticated API endpoint (`GET /api/applications/:id/resume`). This endpoint verifies that the requester is either the employer who owns the job or the applicant before streaming the file.

---

## 🌐 API Documentation

### Auth Routes
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Authenticate and receive JWT
- `GET /api/auth/me` - Get current user profile (Protected)

### Job Routes
- `GET /api/jobs` - List all jobs (Supports `?search`, `?location`, `?type` filters)
- `GET /api/jobs/:id` - Get single job
- `POST /api/jobs` - Create a job (Protected, Employer only)
- `PUT /api/jobs/:id` - Update a job (Protected, Employer owner only)
- `DELETE /api/jobs/:id` - Delete a job (Protected, Employer owner only)

### Application Routes
- `POST /api/applications/:jobId` - Apply to a job (Protected, Seeker only)
- `GET /api/applications/my-applications` - Get seeker's applications (Protected, Seeker only)
- `GET /api/applications/job/:jobId` - Get applicants for a job (Protected, Employer owner only)
- `GET /api/applications/:id/resume` - Securely download resume (Protected, Owner or Applicant)
- `PUT /api/applications/:id/status` - Update application status (Protected, Employer owner only)

---

## 📦 Deployment Steps

This repository is optimized for deployment on platforms like Render, Heroku, or DigitalOcean App Platform.

1. Set the environment variables (`MONGO_URI`, `JWT_SECRET`, `NODE_ENV=production`) in your hosting dashboard.
2. The build command should be set to:
   ```bash
   npm run build
   ```
   *This invokes Vite to compile the optimized React frontend into the `dist/` directory.*
3. The start command should be set to:
   ```bash
   npm start
   ```
   *This starts the Express server. In production, Express automatically routes unmatched requests (SPA Fallback) to `dist/index.html`.*
