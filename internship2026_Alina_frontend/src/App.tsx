import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from 'react-router-dom';
import { GalleryPage } from './page/GalleryPage';
import { SignUpPage } from './page/SignUpPage';
import { SignInPage } from './page/SignInPage';
import { AuthLayout } from './component/AuthLayout';
import { ForgotPasswordPage } from './page/ForgotPasswordPage';
import { ResetPasswordPage } from './page/ResetPasswordPage';
import { PasswordSavedPage } from './page/PasswordSavedPage';
import { ProfilePage } from './page/ProfilePage';
import { DashboardPage } from './page/DashboardPage';



const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    return <Navigate to="/auth/signin" replace />;
  }

  return <>{children}</>;
};

const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (token) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

const router = createBrowserRouter([
  {
    path: '/',
    element: (

        <DashboardPage />

    ),
    children: [
      {
        path: 'galleries',
        element: <GalleryPage />,
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
]);

export const App = () => {
  return <RouterProvider router={router} />;
};
