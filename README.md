# AI Job Application Tracker

This repository contains a MERN-style job application tracker with AI-assisted parsing and resume suggestion support.

## Stack
- Frontend: React + TypeScript + Vite + Tailwind CSS
- Backend: Node.js + Express + TypeScript
- Database: MongoDB + Mongoose
- Auth: JWT + bcrypt
- AI: NVIDIA NIM
- State management: React Query

## Deployment

### Live Demo
```bash
https://apply-ai-iota.vercel.app/
```

### Backend (Railway)
1. Create a Railway account at https://railway.app
2. Connect your GitHub repository
3. Add these environment variables in Railway:
   - `MONGODB_URI`
   - `JWT_SECRET`
   - `NIM_API_KEY`
   - `NIM_API_URL`
   - `NIM_MODEL`
   - `FRONTEND_URL` (your Vercel/Netlify URL)
4. Railway will auto-deploy when you push to main

### Frontend (Vercel)
1. Create a Vercel account at https://vercel.com
2. Connect your GitHub repository
3. Add environment variable: `VITE_API_BASE_URL` = your Railway backend URL
4. Deploy automatically

### Alternative Platforms
- **Render**: Similar to Railway, supports Node.js + MongoDB
- **Netlify**: Alternative to Vercel for frontend
- **Heroku**: Traditional but has free tier limitations

```env
NIM_MODEL=llama-3.1-405b-instruct
```

### 2. Backend
```bash
cd backend
npm install
npm run dev
```

### 3. Frontend
```bash
cd frontend
npm install
npm run dev
```

## Backend API
- `POST /api/auth/register` - register a new user
- `POST /api/auth/login` - log in and receive a JWT
- `GET /api/applications` - list current user's applications
- `POST /api/applications` - create application
- `PUT /api/applications/:id` - update application
- `DELETE /api/applications/:id` - delete application
- `POST /api/applications/parse` - parse a job description and get resume suggestions

## Notes
- Do not commit real secret values.
- The backend uses `NIM_API_KEY` and `NIM_API_URL` to connect to NVIDIA NIM.
- The frontend reads `VITE_API_BASE_URL` to call the backend.

## Decision highlights
- AI logic is placed in `backend/src/services/aiService.ts`.
- Auth is separated into service, controller, and route layers.
- The frontend uses React Query for data fetching and cache invalidation.
- The board supports drag-and-drop status updates and card detail display.
