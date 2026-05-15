import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { logout } from '../store/slices/auth/auth.slice';
import { useLogoutMutation } from '../store/api/authApi';

export const useLogOut = () => {
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [serverLogout] = useLogoutMutation();

  const logoutUser = async () => {
    try {
      await serverLogout().unwrap();
    } catch (error) {
      console.error(error);
    } finally {
      dispatch(logout());

      navigate('/auth/signin', {
        replace: true,
      });
    }
  };

  return {
    logout: logoutUser,
  };
};
