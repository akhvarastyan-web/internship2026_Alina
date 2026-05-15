import { AccountSettingsForm } from './AccountSettingsForm';
import { ChangePasswordForm } from './ChangePasswordForm';
import { useState } from 'react';
import { useAppSelector } from '../hooks/redux';
import { ChangeEvent } from 'react';
import { Camera } from 'lucide-react';
import {

  useUpdateBackgroundMutation,
  useGetProfileQuery,
  useUpdateAvatarMutation,
} from '../store/api/userApi';

export const ProfileSettings = () => {
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const user = useAppSelector(state => state.auth.user);

  const { data: profile, isLoading } = useGetProfileQuery();


  const [uploadBackground, { isLoading: isBgUploading }] = useUpdateBackgroundMutation();
  const [uploadAvatar, { isLoading: isAvatarUploading }]= useUpdateAvatarMutation();

  const fullName = `${user?.firstname ?? 'User'} ${user?.lastname ?? 'User'}`;

  const handleSuccess = () => {
    setIsSuccessModalOpen(true);
  };


const handleBackgroundChange = async (e: ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    try {
      await uploadBackground(file).unwrap();
    } catch (error: any) {

    }
  }
};

const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
  if (e.target.files && e.target.files[0]) {
    const file = e.target.files[0];
    try {
      await uploadAvatar(file).unwrap();
    } catch (error) {
  }
};
}

  return (
    <div className="w-full p-5 flex flex-col gap-20 items-center">
      <div className="relative flex flex-col items-center w-full max-w-[1020px]">
        <div
  className="
    bg-accent
    rounded-b-lg overflow-hidden
    w-[311px] h-[124px]
    lg:w-[1020px] lg:h-[120px]
  "
>
  <div
    className="relative w-full h-full bg-cover bg-center"
    style={{
      backgroundImage: `url(${profile?.backgroundUrl ? `http://localhost:3000${profile.backgroundUrl}` : '/default-bg.jpg'})`,
    }}
  >
    <label className="absolute bottom-2 right-2 bg-white p-1.5 rounded-full cursor-pointer flex items-center justify-center shadow-md border border-gray-200 hover:bg-gray-100 transition-colors">
      {isBgUploading ? (
        <span className="text-[10px] font-bold text-gray-600">...</span>
      ) : (
        <Camera className="w-4 h-4 text-gray-600" />
      )}
      <input type="file" accept="image/*" onChange={handleBackgroundChange} className="hidden" />
    </label>
  </div>
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
          <div className="w-full h-full rounded-full border-4 border-white bg-accent-soft overflow-hidden">
    <img
     src={profile?.avatarUrl ? `http://localhost:3000${profile.avatarUrl}` : '/path-to-avatar.jpg'}
      alt="Avatar"
      className="w-full h-full object-cover"
    />
  </div>

  <label
    className="
      absolute bottom-0 right-0
      w-7 h-7
      bg-white text-text-primary
      rounded-full border border-gray-200
      flex items-center justify-center
      shadow-md cursor-pointer
      hover:bg-gray-100 transition-colors
      z-10
    "
  >
    {isAvatarUploading ? (
      <span className="text-[10px] font-bold">...</span>
    ) : (
      <Camera className="w-4 h-4 text-gray-600" />
    )}

    <input
      type="file"
      accept="image/*"
      onChange={handleAvatarChange}
      disabled={isAvatarUploading}
      className="hidden"
    />
  </label>
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
