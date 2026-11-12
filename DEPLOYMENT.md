# SBCyberBasics Academy — Production Deployment & Repository Guide

This document outlines the standard production deployment procedures, environment configuration, repository organization, and performance optimizations for **SBCyberBasics Academy**.

---

## 1. GitHub Repository Organization

To maintain institutional engineering standards and clean version control, structure the GitHub repository as follows:

```
sbcyberbasics-academy/
├── .github/
│   └── workflows/
│       ├── ci.yml                 # Automated TypeScript typecheck, lint, and build test
│       └── deploy.yml             # Automated CD pipeline for production hosting
├── .env.example                   # Environment configuration template (NO secrets)
├── .gitignore                     # Git ignore rules for node_modules, dist, .env
├── firebase.json                  # Firebase Hosting and Firestore deployment config
├── firestore.rules                # Hardened Zero-Trust Firestore Security Rules
├── firebase-blueprint.json        # Firestore intermediate schema representation
├── index.html                     # HTML5 entry point with SEO and OpenGraph metadata
├── metadata.json                  # Platform metadata configuration
├── package.json                   # Project dependencies and build scripts
├── tsconfig.json                  # Strict TypeScript configuration
├── vite.config.ts                 # Vite bundler configuration with Tailwind CSS v4
├── SECURITY_AUDIT_REPORT.md       # Full security audit and remediation report
├── DEPLOYMENT.md                  # This deployment manual
├── src/
│   ├── main.tsx                   # React root entry wrapped in ErrorBoundary
│   ├── App.tsx                    # Top-level view router and notification system
│   ├── index.css                  # Global Tailwind CSS imports
│   ├── config/
│   │   └── firebase.ts            # Secure Firebase App, Auth, and Firestore initialization
│   ├── context/
│   │   └── AuthContext.tsx        # React Context for session management and user profile
│   ├── components/
│   │   ├── common/                # Reusable UI (Logo, ErrorBoundary)
│   │   ├── layout/                # Global layout (Navbar, Footer)
│   │   ├── home/                  # Homepage sections (Hero, Courses, Paths, Stats, FAQ)
│   │   ├── certificate/           # Institutional CertificateRenderer
│   │   └── modals/                # AuthModal, CourseDetailModal, VerifyCertModal
│   ├── data/
│   │   ├── coursesData.ts         # 7 standardized cybersecurity core curriculum courses
│   │   ├── learningPathsData.ts   # Structured cybersecurity career tracks
│   │   └── cyberLabsData.ts       # 7 hands-on guided laboratory scenarios and targets
│   ├── pages/
│   │   ├── StudentDashboardPage.tsx # Enrolled courses, progress tracker, cert claims
│   │   ├── ClassroomPage.tsx        # Video player, lecture notes, lab assignments, quiz
│   │   ├── LabsWorkbenchPage.tsx    # Cyber Labs simulated terminal workbench
│   │   ├── VerifyCertificatePage.tsx# Public cryptographic certificate verification portal
│   │   ├── AboutPage.tsx            # Institutional mission, leadership, ethics code
│   │   └── ContactPage.tsx          # Institutional support and enterprise inquiries
│   ├── services/
│   │   ├── authService.ts           # Firebase Auth and student profile management
│   │   ├── courseService.ts         # Firestore course catalog synchronization
│   │   ├── progressService.ts       # Progress tracking, lesson completion, quiz recording
│   │   └── certificateService.ts    # Completion verification and SHA-256 certificate issuing
│   ├── types/
│   │   └── index.ts               # Core domain models and TypeScript interfaces
│   └── utils/
│       └── security.ts            # Sanitization, password complexity, Web Crypto SHA-256
```

---

## 2. Environment Variables & Production Configuration

Configure the following variables in your hosting provider's environment variables panel:

| Variable | Description | Example |
| :--- | :--- | :--- |
| `APP_URL` | Canonical production URL | `https://academy.sbcyberbasics.com` |
| `VITE_FIREBASE_API_KEY` | Firebase Web API Key | `AIzaSy...` |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication Domain | `sbcyberbasics.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | Google Cloud / Firebase Project ID | `robust-messenger-zwpgt` |
| `VITE_FIREBASE_DATABASE_ID` | Specific Firestore Database Instance | `ai-studio-sbcyberbasicsaca-...` |
| `VITE_ADMIN_EMAIL` | Root Institutional Administrator Email | `shahedullahibashirgusau@gmail.com` |

---

## 3. Deployment Targets

### Option A: Firebase Hosting (Recommended)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   firebase login
   ```

2. **Initialize Firebase in the root folder:**
   ```bash
   firebase use robust-messenger-zwpgt
   ```

3. **Deploy Security Rules and Build:**
   ```bash
   npm run build
   firebase deploy --only firestore:rules,hosting
   ```

### Option B: Cloud Run / Docker Container

A production `Dockerfile` for multi-stage static asset serving via Nginx or Node:

```dockerfile
# Stage 1: Build static assets
FROM node:22-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve with lightweight web server
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
```

### Option C: Vercel / Netlify

1. Connect the GitHub repository to Vercel/Netlify.
2. Build Settings:
   - **Framework Preset:** Vite
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
   - **Node Version:** `20.x` or `22.x`
3. Single Page Application (SPA) rewrite rule:
   - For Vercel: add `vercel.json` with `{"rewrites": [{"source": "/(.*)", "destination": "/index.html"}]}`.
   - For Netlify: add `public/_redirects` with `/* /index.html 200`.

---

## 4. Mobile Responsiveness & Viewport Optimization

- Tested on viewports from mobile (360px) to ultra-wide (2560px).
- Navigation switches gracefully between full desktop toolbar and touch-optimized mobile slide-out drawer.
- The Cyber Labs simulated terminal workbench scales fluidly with horizontal scrollbars for commands on small screens.
- Digital Certificates include media query `@media print` rules, enabling crisp vector printing and export to PDF.

---

## 5. Performance Optimizations Implemented

1. **Vite Bundler Tree-Shaking:** Dynamic imports and modular Lucide icon loading reduce client bundle weight.
2. **Native Web Crypto:** Uses browser hardware-accelerated `crypto.subtle` for SHA-256 digests rather than bulky external crypto libraries.
3. **Firestore Read Cost Control:** Prohibits `list` queries on user profiles and certificate registries; single-document `getDoc` lookups prevent quadratic O(n) read costs.
4. **Offline Connection Tolerance:** `testFirestoreConnection()` traps offline errors gracefully without blocking UI initialization.
