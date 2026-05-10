import { useNavigate } from 'react-router-dom';

export const useLogOut = () => {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    sessionStorage.removeItem('token');

    navigate('/login', { replace: true });
  };

  return { logout };
};
