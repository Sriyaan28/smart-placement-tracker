# Smart Placement Tracker

A comprehensive, role-based platform designed to streamline the placement process for students, companies, and administrators. 

## Live Website
**Production Environment:** [https://smart-placement-tracker-sigma.vercel.app](https://smart-placement-tracker-sigma.vercel.app)

## Features by Role

### 1. General Features
- Registration for Students and Companies (Admin accounts are pre-provisioned).
- Secure Authentication (Login/Logout) via JWT.
- Role-based Access Control (RBAC).
- Profile Management: View, Update (name, bio, password), and Delete profile securely.

### 2. Students 
- **Resume Management:** Upload, parse (PDF to text), view, and delete resumes (one resume per student constraint).
- **Job Discovery:** View active job openings and comprehensive company profiles.
- **Application Tracking:** Apply for jobs, view application statuses, and track detailed job statistics.
- **Reporting System:** Flag suspicious job postings or companies to the administration.
- **Notifications:** Receive instant updates regarding job applications and interview schedules.

### 3. Companies 
- **Job Management:** Complete CRUD operations for job openings.
- **Student Discovery:** View detailed student profiles and access uploaded resumes.
- **Application Management:** Track and manage student applications via the Company Dashboard.
- **Interview Scheduling:** Create and manage interview schedules for applicants.
- **Reporting System:** Report unprofessional student behavior to the administration.
- **Notifications:** Receive alerts for new applications and interview updates.
- **Verified Status:** Display a "Verified Status" badge upon approval by Admin.

### 4. Administrator 
- **User Management:** Full moderation control to add, remove, and update users across all roles.
- **Company Verification:** Manage "Verified Status" for trusted company accounts.
- **Content Moderation Dashboard:** Review and act upon reports submitted by students (against jobs/companies) or companies (against students).
- **System Oversight:** Manage roles, handle job openings globally, and oversee overall platform integrity.

---

## Technology Stack & Modules

### Frontend
Built with **React (Vite)** and styled with **Tailwind CSS**.
**Key Modules:**
- `react`, `react-dom`, `react-router-dom`: Core framework and routing.
- `tailwindcss`, `@tailwindcss/vite`: Styling.
- `axios`: API communication.
- `lucide-react`: Iconography.

### Backend
Built with **Node.js** and **Express.js**, using **MongoDB** (Mongoose) for the database.
**Key Modules:**
- `express`: Web server framework.
- `mongoose`: MongoDB object modeling.
- `bcrypt`, `jsonwebtoken`: Security and authentication.
- `multer`, `cloudinary`, `pdf-parse`: File uploads, image hosting, and resume parsing.
- `groq-sdk`: AI smart merge and processing features.
- `cors`, `cookie-parser`, `dotenv`: Middleware and environment configuration.

---

## ⚙️ How to Install and Run Locally

### Prerequisites
- Node.js installed on your machine.
- MongoDB instance (local or Atlas URI).
- Cloudinary credentials (for image uploads).
- Groq API Key (for AI features).

### 1. Clone the repository
```bash
git clone <repository-url>
cd smart-placement-tracker
```

### 2. Backend Setup
Open a terminal and navigate to the `backend` directory:
```bash
cd backend
```
Install backend dependencies:
```bash
npm install
```
Create a `.env` file in the `backend` folder and add your environment variables (e.g., `PORT`, `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`, `GROQ_API_KEY`).

Start the backend development server:
```bash
npm start
# Under the hood this runs: node server.js
```
The backend server runs on `http://localhost:4000` by default.

### 3. Frontend Setup
Open a new terminal and navigate to the `frontend` directory:
```bash
cd frontend
```
Install frontend dependencies:
```bash
npm install
```
Start the frontend development server:
```bash
npm run dev
```
The frontend application will run on `http://localhost:5173`.
