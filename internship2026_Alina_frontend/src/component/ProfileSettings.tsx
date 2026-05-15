import { AccountSettingsForm } from './AccountSettingsForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';

export const ProfileSettings = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const user = useAppSelector(state => state.auth.user);

  const fullName = `${user?.firstname ?? 'User'} ${user?.lastname ?? 'User'}`;

  const handleSuccess = () => {
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="w-full p-5 flex flex-col gap-20 items-center">
      <div className="relative flex flex-col items-center w-full max-w-[1020px]">
        <div
          className="
            bg-accent rounded-b-lg overflow-hidden
            w-[311px] h-[124px]
            lg:w-[1020px] lg:h-[120px]
          "
        >
          <img
            src="/path-to-cover.jpg"
            alt="Cover"
            className="w-full h-full object-cover"
          />
        </div>

        <div
          className="
            relative
            w-[90px] h-[90px]
            rounded-full border-4 border-white bg-accent-soft
            overflow-hidden
            -mt-[45px]
          "
        >
          <img
            src="/path-to-avatar.jpg"
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>

        <div className="text-center">
          <h1 className="text-xl font-bold">{fullName}</h1>
          <p className="text-text-secondary">{user?.email ?? 'No email'}</p>
        </div>
      </div>

      <div
        className="w-full max-w-[1020px] flex flex-col items-center gap-10
      lg:flex-row
      lg:items-start
      lg:gap-5"
      >
        <div className="flex-1 w-full">
          <AccountSettingsForm onSuccess={handleSuccess} />
        </div>

        <div className="flex-1 w-full">
          <ChangePasswordForm onSuccess={handleSuccess} />
        </div>

        {isSuccessModalOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm"
            onClick={() => setIsSuccessModalOpen(false)}
          >
            <div
              className="bg-bg-main rounded-xl shadow-xl flex items-center justify-center"
              style={{ width: '398px', height: '252px' }}
              onClick={e => e.stopPropagation()}
            >
              <span className="text-2xl font-bold text-text-primary">
                Changes saved
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
