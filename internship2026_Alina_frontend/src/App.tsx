import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
  Outlet,
} from 'react-router-dom';
import { GalleryPage } from './page/GalleryPage';
import { SignUpPage } from './page/SignUpPage';
import { SignInPage } from './page/SignInPage';
import { AuthLayout } from './component/common/AuthLayout';
import { ForgotPasswordPage } from './page/ForgotPasswordPage';
import { ResetPasswordPage } from './page/ResetPasswordPage';
import { PasswordSavedPage } from './page/PasswordSavedPage';
import { ProfilePage } from './page/ProfilePage';
import { DashboardPage } from './page/DashboardPage';
import { CreateGalleryPage } from './page/CreateGalleryPage';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { PublicRoute } from './routes/PublicRoute';
import { AuthProvider } from './providers/authProvider';


const router = createBrowserRouter([
  {
    element: (
      <AuthProvider>
        <Outlet />
      </AuthProvider>
    ),
    children: [
      {
        path: '/',
        element: (
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        ),
        children: [
          {
            path: 'galleries',
            element: <GalleryPage />,
          },
          {
            path: 'create-gallery',
            element: <CreateGalleryPage />,
          },
          {
            path: 'profile-settings',
            element: <ProfilePage />,
          },
        ],
      },
      {
    path: '/auth',
    element: (
      <PublicRoute>
        <AuthLayout />
      </PublicRoute>
    ),
    children: [
      {
        path: 'signup',
        element: <SignUpPage />,
      },
      {
        path: 'signin',
        element: <SignInPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'reset-password',
        element: <ResetPasswordPage />,
      },
      {
        path: 'password-saved',
        element: <PasswordSavedPage />,
      },
    ],
  },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export const App = () => <RouterProvider router={router} />;

