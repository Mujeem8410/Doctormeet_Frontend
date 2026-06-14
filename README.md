# Frontend Application

This repository contains the frontend for the Doctor Appointment system. The application is implemented in React and uses Vite for fast development and build performance.

The frontend serves as the user interface for patients, doctors, and administrators. It connects to the backend API to perform authentication, appointment management, profile updates, notifications, and video consultation flows.

## Overview

The frontend provides the following core capabilities:

- User authentication and account management.
- Role-based dashboards for patients, doctors, and administrators.
- Appointment booking and appointment history views.
- Video call sessions for online consultations.
- Real-time notifications using WebSocket integration.
- Review submission and feedback features.

## Main application flows

1. Public landing page and registration flow.
2. Login for existing users.
3. Password recovery via the forgot password page.
4. Patient dashboard to view appointments, book services, and manage profile.
5. Doctor dashboard to view assigned appointments, availability, and video sessions.
6. Admin dashboard with user and appointment management.

## Supported user roles

- Patient
- Doctor
- Administrator

Each role has a dedicated dashboard and access controls enforced through route protection.

## Key features

- React + Vite project structure.
- Browser routing with React Router.
- Protected routes based on user role.
- Toast notifications for user feedback.
- Socket.io client for real-time events.
- Razorpay payment integration support.
- Charting support for dashboards using Chart.js.
- Tailwind CSS configuration for styling.

## Application pages and components

The frontend includes the following pages and components:

- `Home` - public landing page.
- `Login` - user login form.
- `Register` - user registration form.
- `ForgotPassword` - password recovery page.
- `ProfilePage` - user profile management.
- `PatientDashboard` - patient-specific dashboard view.
- `DoctorDashboard` - doctor-specific dashboard view.
- `AdminDashboard` - administrator dashboard.
- `AdminUsers` - admin view for managing users.
- `AdminAppointments` - admin view for managing appointments.
- `VideoCall` - patient video consultation interface.
- `DoctorVideoCall` - doctor video consultation interface.

## Routes and navigation

The application uses the following routes:

- `/` - Home
- `/login` - Login page
- `/register` - Registration page
- `/profile` - Profile page
- `/forgot-password` - Forgot password page
- `/patient/dashboard` - Patient dashboard
- `/doctor/dashboard` - Doctor dashboard
- `/admin/dashboard` - Admin dashboard
- `/admin/users` - Admin user management
- `/admin/appointments` - Admin appointment management
- `/video-call/:roomId` - Patient video session
- `/video-call/:roomId/:appointmentId` - Patient video session with appointment context
- `/doctor/video-call/:roomId` - Doctor video session
- `/doctor/video-call/:roomId/:appointmentId` - Doctor video session with appointment context

## Development setup

To run this frontend locally, follow these steps:

1. Open a terminal in the `frontend` folder.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in the terminal to view the application.

## Build and preview

To create a production build, run:

```bash
npm run build
```

To preview the built application locally, run:

```bash
npm run preview
```

## Linting

The frontend includes ESLint configuration. Run the following command to check the code:

```bash
npm run lint
```

## Project dependencies

This project depends on the following libraries:

- `react` and `react-dom` for building user interfaces.
- `react-router-dom` for client-side routing.
- `axios` for API requests.
- `react-toastify` for toast notifications.
- `socket.io-client` for real-time notifications.
- `react-icons` for icon rendering.
- `chart.js` and `react-chartjs-2` for charts and dashboards.
- `react-razorpay` for Razorpay payment integration.

## Development dependencies

The project uses these development dependencies:

- `vite` as the build tool.
- `@vitejs/plugin-react` for React support in Vite.
- `eslint` and `@eslint/js` for code quality checks.
- `eslint-plugin-react-hooks` for React hooks linting.
- `tailwindcss` and `postcss` for styling support.

## Folder structure

The frontend folder is organized as follows:

- `src/` – source files for the React application.
  - `App.jsx` – main application component and route setup.
  - `main.jsx` – entry point for React.
  - `pages/` – page components for each route.
  - `components/` – reusable UI components.
  - `helper/` – helper utilities such as route protection.
  - `utils/` – utility modules for API calls and runtime configuration.
- `public/` – static assets served by Vite.
- `package.json` – dependency and script configuration.
- `vite.config.js` – Vite build and dev server configuration.

## Backend integration

This frontend is designed to work with the backend API located in the sibling `backend` folder. The backend must run separately for authentication, appointment data, user management, and video call support.

Make sure the backend is running and the runtime configuration in `src/utils/runtimeConfig.js` points to the correct API and socket server URLs.

## Usage notes

- The frontend assumes a token-based authentication flow.
- Protected routes require the correct user role to access.
- Real-time notifications are delivered through socket events.
- Video call pages are accessible only when a valid `roomId` is provided.

## Maintenance

- Keep dependencies updated to maintain security and compatibility.
- Use ESLint and a consistent formatting approach for code quality.
- Review `src/utils/api.js` and `src/helper/PrivateRoute.jsx` when updating authentication or route protection logic.

## Summary

This frontend provides a complete web interface for a doctor appointment system. It is built with React and Vite, supports multiple user roles, and is prepared for real-time notifications and video consultation workflows.

The README above is intentionally detailed to help new developers quickly understand the project structure, how to run it, and what functionality is included.
a