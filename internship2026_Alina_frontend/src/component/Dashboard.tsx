import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ProfileSideBar } from './ProfileSideBar';
import { Header } from './common/Headers';
import { RootState } from '../store/index';


export const Dashboard = () => {
  const { title, buttonConfig } = useSelector(
    (state: RootState) => state.dashboardHeader,
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  return (
    <div className="flex min-h-screen">
      <aside
        className={`
        fixed z-50 profile-sidebar-w bg-bg-soft rounded-2xl shadow-lg
        transition-transform duration-300 lg:relative lg:translate-x-0
        top-0 bottom-0 m-4 lg:m-[30px]
         shrink-0
        ${
          isMenuOpen
            ? 'left-0 opacity-100'
            : 'left-[-100%] opacity-0 lg:left-0 lg:opacity-100'
        }
`}
      >
        <div className="absolute inset-0 flex flex-col">
          <ProfileSideBar />

          <button
            className="absolute top-5 right-5 lg:hidden"
            onClick={() => setIsMenuOpen(false)}
          >
            <X />
          </button>
        </div>
      </aside>

      <main className="flex-1">
        <header className="w-full">
          <div className="flex items-center gap-[50px] p-4 lg:px-[30px] lg:py-[22px]">
            <div className="flex-1 min-w-0">
              <Header>{title || 'Dashboard'}</Header>
            </div>

            <div className="shrink-0 flex items-center gap-4">
            {buttonConfig && buttonConfig.link && (
              <Link
                to={buttonConfig.link}
                className="hidden lg:block text-accent border border-accent px-4 py-2 rounded-full hover:underline whitespace-nowrap"
              >
                {buttonConfig.text}
              </Link>
            )}

              <button
                className=" lg:hidden"
                onClick={() => setIsMenuOpen(true)}
              >
                <Menu size={24} />
              </button>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>

      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={() => setIsMenuOpen(false)}
        />
      )}
    </div>
  );
};
