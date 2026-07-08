/* =======================================================
 *
 * Created by anele on 01/07/2026.
 *
 * @anele_ace
 *
 * =======================================================
 */

import React from 'react'
import { Provider } from './theme/Provider'
import { createRoot } from 'react-dom/client'
import Root, { loader as rootLoader } from './routes/root'
import { Navigate, RouterProvider, createBrowserRouter } from 'react-router-dom'
import { AuthLayout, authLayoutLoader, ProtectedLayout, protectedLayoutLoader, } from './layouts'
import {
  ErrorPage,
  LoginPage,    LoginLoader,    LoginAction,
  LandingPage,  LandingLoader,  LandingAction,
  RegisterPage, registerLoader, registerAction,
  DashBoard,    dashboardLoader,
} from './routes/'

const appRoutes = createBrowserRouter([
  {
    path: '/',
    id: 'root',
    element: <Root />,
    loader: rootLoader,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Navigate to="/home" replace /> },

      // ── Public ──────────────────────────────────────────────────────────
      { path: 'home', element: <LandingPage />, loader: LandingLoader, action: LandingAction },

      // ── Auth (guest-only: redirect away if already logged in) ───────────
      {
        element: <AuthLayout />,
        loader: authLayoutLoader,
        children: [
          { path: 'login',    element: <LoginPage />,    loader: LoginLoader,    action: LoginAction    },
          { path: 'register', element: <RegisterPage />, loader: registerLoader, action: registerAction },
        ],
      },

      // ── Protected (redirect to /login if not authenticated) ─────────────
      {
        element: <ProtectedLayout />,
        loader: protectedLayoutLoader,
        errorElement: <ErrorPage />,
        children: [
          { path: 'dashboard', element: <DashBoard />, loader: dashboardLoader },
        ],
      },
    ],
  },
])

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider>
      <RouterProvider router={appRoutes} />
    </Provider>
  </React.StrictMode>,
);
