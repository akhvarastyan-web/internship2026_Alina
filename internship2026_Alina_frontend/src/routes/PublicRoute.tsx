import { Navigate } from 'react-router-dom';
import { FullScreenLoader } from '../component/common/FullScreenLoader';
import { useAppSelector } from '../hooks/redux';

export const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isInitialized } = useAppSelector(
    state => state.auth,
  );

  if (!isInitialized) {
    return <FullScreenLoader />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
