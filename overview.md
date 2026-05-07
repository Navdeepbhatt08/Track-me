# Expense Tracker Overview

## Project Summary

This project is a full-stack Expense Tracker application built with:

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB via Mongoose
- Authentication: JWT stored in an HTTP-only cookie
- State management: React Context for authentication and expense data

The app allows users to sign up, log in, track income and expenses, view reports, and manage personal settings.

## Project Structure

```
Expense-Tracker/
  package.json
  overview.md
  client/
    package.json
    src/
      App.jsx
      AppRouter.jsx
      main.jsx
      lib/api.js
      state/
        AuthContext.jsx
        ExpenseContext.jsx
        ThemeContext.jsx
      pages/
        DashboardPage.jsx
        LoginPage.jsx
        SignupPage.jsx
        TransactionsPage.jsx
        TransactionFormPage.jsx
        ReportsPage.jsx
        SettingsPage.jsx
      components/
        Layout.jsx
        navbar.jsx
  server/
    package.json
    server.js
    app.js
    config/db.js
    controllers/
      authController.js
      transactionController.js
      settingsController.js
    middleware/
      auth.js
      errorHandler.js
      notFound.js
    models/
      User.js
      Transaction.js
      UserSettings.js
    routes/
      authRoutes.js
      transactionRoutes.js
      settingsRoutes.js
    .env
```

## How the Backend Works

### Server startup

- `server/server.js` loads environment variables from `.env` and starts the Express app.
- `server/config/db.js` connects to MongoDB using `mongoose.connect()`.
- The server listens on `PORT` (default `8000`).

### Express configuration

- `server/app.js` configures middleware:
  - `express.json()` to parse JSON request bodies
  - `cookie-parser` to read cookies
  - `cors` to allow the React frontend to communicate with the backend
  - `morgan` for request logging
- It mounts API routes under `/api/auth`, `/api/transactions`, and `/api/settings`.
- It adds 404 and error-handling middleware.

### Authentication flow

- `server/routes/authRoutes.js` defines authentication endpoints.
- `server/controllers/authController.js` implements:
  - `signup` — create a new user and issue JWT cookie
  - `login` — verify credentials and issue JWT cookie
  - `logout` — clear cookie
  - `me` — return authenticated user data
- `server/middleware/auth.js` verifies `token` cookie and adds `req.user` to the request.

### Transactions API

- `server/routes/transactionRoutes.js` defines CRUD endpoints for transaction data.
- All transaction routes are protected by `requireAuth`.
- `server/controllers/transactionController.js` handles:
  - listing transactions with filters, search, and date range
  - creating new transactions
  - retrieving, updating, and deleting a single transaction
  - generating a summary of income and expense totals

### Settings API

- `server/routes/settingsRoutes.js` defines settings endpoints.
- `server/controllers/settingsController.js` handles:
  - fetching user settings
  - updating settings
  - clearing all transaction data and resetting settings to defaults

### Database models

- `server/models/User.js` stores user email, name, hashed password, and optional profile fields.
- `server/models/Transaction.js` stores transaction details and links each record to a user.
- `server/models/UserSettings.js` stores user preferences like currency, budget, theme, and notifications.

## How the Frontend Works

### Application entry

- `client/src/main.jsx` renders React and wraps the app with:
  - `BrowserRouter`
  - `ThemeProvider`
  - `AuthProvider`
  - `ExpenseProvider`

### Routing

- `client/src/AppRouter.jsx` connects routes to pages:
  - `/` → `DashboardPage`
  - `/login` → `LoginPage`
  - `/signup` → `SignupPage`
  - `/transactions` → `TransactionsPage`
  - `/add` → `TransactionFormPage` (add mode)
  - `/edit/:id` → `TransactionFormPage` (edit mode)
  - `/reports` → `ReportsPage`
  - `/settings` → `SettingsPage`

### API layer

- `client/src/lib/api.js` sends requests to `http://localhost:8000/api`.
- It uses `credentials: 'include'` so the server receives the authentication cookie.
- It exposes:
  - `authAPI` for login/signup/logout/me
  - `transactionsAPI` for transaction CRUD and summary
  - `settingsAPI` for user settings and clearing data

### Authentication state

- `client/src/state/AuthContext.jsx` maintains:
  - `user`
  - `loading`
  - `error`
- On mount it calls `authAPI.me()` to check if the user is already signed in.
- It exposes `signup`, `login`, and `logout` functions.

### Expense state

- `client/src/state/ExpenseContext.jsx` stores:
  - transactions
  - settings
  - loading and error states
- When authenticated, it loads settings and transactions from the server.
- It provides methods to add, update, delete transactions and update settings.

### Theme management

- `client/src/state/ThemeContext.jsx` stores theme preference in `localStorage`.
- It toggles dark/light mode and applies the `dark` class to the HTML root.

### Layout and pages

- `client/src/components/Layout.jsx` renders the `Navbar` and page content.
- `LoginPage.jsx` and `SignupPage.jsx` submit auth forms to backend endpoints.
- Transaction pages use the expense context to view and manage transaction data.

## Full request flow

1. User opens the app.
2. `AuthProvider` calls `/api/auth/me` using the stored cookie.
3. If authenticated, `ExpenseProvider` fetches settings and transactions.
4. User can view dashboards, add/edit/delete transactions, and change settings.
5. Each action goes through the API client to the backend, using JWT cookie auth.

## Environment and running the app

The backend expects a `.env` with values like:

- `PORT=8000`
- `NODE_ENV=development`
- `JWT_SECRET=...`
- `JWT_EXPIRES_IN=7d`
- `MONGODB_URI=mongodb://127.0.0.1:27017/expense-tracker`
- `CORS_ORIGIN=http://localhost:5173`

To run locally:

1. Start backend:
   - `cd server`
   - `npm install`
   - `npm run dev`
2. Start frontend:
   - `cd client`
   - `npm install`
   - `npm run dev`

## Summary

This app uses a React frontend that communicates with an Express API backend using cookie-based JWT auth. The backend stores users, transactions, and settings in MongoDB, and the frontend keeps state in React Context for auth and expense data.
