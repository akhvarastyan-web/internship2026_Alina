import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogOut } from '../utils/LogOutFunction';
import { useAppSelector } from '../hooks/redux';
import { useFindAllGalleriesQuery } from '../store/api/galleryApi';

export const ProfileSideBar = ({ onClose }: { onClose?: () => void }) => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const [isListOpen, setIsListOpen] = useState(false);
  const { logout } = useLogOut();
  const { data: galleriesData, isLoading } = useFindAllGalleriesQuery({ page: 1, limit: 7 });

  const user = useAppSelector(state => state.auth.user);

  const fullName = `${user?.firstname ?? 'User'} ${user?.lastname ?? 'User'}`;

  const handleLinkClick = () => {
    if (window.innerWidth < 1024 && onClose) {
      onClose();
    }
  };

  const handleLogout = () => {
    handleLinkClick();
    logout();
  };

  return (
    <div className="relative h-full flex flex-col">
      <div className="mt-[36px] ml-[54px] shrink-0">
        <img src="/logo.svg" alt="Top image" className="w-[158px] h-auto" />
      </div>

      <div className="flex flex-col gap-form mt-10 px-5">
        <div className="flex flex-col">
          <div
            className="flex items-center justify-between cursor-pointer"
            onClick={() => setIsFolderOpen(!isFolderOpen)}
          >
            <div className="flex items-center gap-2">
              <img src="/gallery.png" alt="Folder Icon" className="size-icon" />
              <span>Gallery</span>
            </div>
            {isFolderOpen ? (
              <ChevronUp className="chevron-icon" />
            ) : (
              <ChevronDown className="chevron-icon" />
            )}
          </div>

          {isFolderOpen && (
            <div className="flex flex-col gap-4 mt-2 pl-4">
              <div className="flex flex-col">
            <div
              className="flex items-center justify-between cursor-pointer text-blue-600 hover:text-blue-700 font-semibold"
              onClick={() => setIsListOpen(!isListOpen)}
            >
              <Link
              to="/galleries" className="flex items-center gap-1.5 text-black">
                List of galleries
              </Link>
              {isListOpen ? (
                <ChevronUp className="w-4 h-4 shrink-0 text-black" />
              ) : (
                <ChevronDown className="w-4 h-4 shrink-0 text-black" />
              )}
            </div>

            {isListOpen && (
              <div className="flex flex-col gap-2 mt-2 pl-4 max-h-[200px] overflow-y-auto">
                {isLoading ? (
                  <span className="text-xs text-gray-400">Loading folders...</span>
                ) : galleriesData?.data && galleriesData.data.length > 0 ? (
                  galleriesData.data.map((gallery) => (
                    <Link
                      key={gallery.id}
                      to={`/galleries/${gallery.id}`}
                      className="text-sm text-gray-700 hover:text-blue-500 truncate block py-0.5"
                    >
                      {gallery.title}
                    </Link>
                  ))
                ) : (
                  <span className="text-xs text-gray-400 italic">No galleries created yet</span>
                )}
              </div>
            )}
          </div>
              <Link
              to="/create-gallery">Create gallery</Link>
              <Link
              to="/create-gallery">Search among galleries</Link>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <img src="/user.png" alt="Folder Icon" className="size-icon" />
              <Link
              to="/">User managment</Link>
            </div>
          </div>
        </div>
      </div>

      <Link
        to="/profile-settings"
        onClick={handleLinkClick}
        className="absolute bottom-[90px] w-[270px] h-[68px] left-1/2 -translate-x-1/2 z-20 bg-accent-soft p-4 rounded-xl"
      >
        <div className="flex gap-2 shrink-0">
          <img
            src="/path-to-your-photo.jpg"
            alt="User"
            className="w-10 h-10 bg-accent rounded-full object-cover"
          />
          <div className="flex flex-col">
            <div className="flex flex-col min-w-0">
              <span className="text-sm font-medium truncate color-text-main">
                {fullName}
              </span>
              <span className="text-xs truncate color-text-secondary">
                {user?.email ?? 'No email'}
              </span>
            </div>
          </div>
        </div>
      </Link>

      <div
        className="absolute bottom-[40px] left-[20px] z-30"
        onClick={handleLogout}
      >
        <div className="flex items-center justify-between">
          <img
            src="/inbound.png"
            alt="Bottom"
            className="size-icon brightness-0 invert-[0.5]"
          />
          <span className="text-text-secondary">Log Out</span>
        </div>
      </div>
    </div>
  );
};
