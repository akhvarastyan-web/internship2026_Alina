import { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useLogOut } from '../utils/LogOutFunction';

export const ProfileSideBar = ({ onClose }: { onClose?: () => void }) => {
  const [isFolderOpen, setIsFolderOpen] = useState(false);
  const { logout } = useLogOut();

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
            <div className="flex flex-col gap-2 mt-2 pl-4">
              <div className="py-1">List of galleries</div>
              <div className="py-1">Search among galleries</div>
            </div>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between cursor-pointer">
            <div className="flex items-center gap-2">
              <img src="/user.png" alt="Folder Icon" className="size-icon" />
              <span>User management</span>
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
                FirstName LastName
              </span>
              <span className="text-xs truncate color-text-secondary">
                user@email.com
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
