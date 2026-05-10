import { FormFooter } from './FormFooter';
import { useLocation, Outlet } from 'react-router-dom';


export const AuthLayout = () => {
  const location = useLocation();

  const isSpecialForm = location.pathname.includes('signup');

  return (
    <main className="
      min-h-screen bg-bg-main
      flex
      lg:flex-row
      lg:w-full
      lg:overflow-hidden
      "
    >
      <div className={`

          w-full
          flex flex-col

          items-center
          px-[clamp(12px,calc(100vw*(16/375)),24px)]
          pt-[clamp(64px,calc(100vw*(79/375)),96px)]


          lg:max-w-none
          lg:flex-row
          ${isSpecialForm ? 'lg:py-[clamp(48px,calc(100vw*(60/1440)),80px)]' : 'lg:py-0'}
          lg:justify-start
          lg:px-0
          ${isSpecialForm ? 'lg:pt-[clamp(48px,calc(100vw*(60/1440)),80px)]' : 'lg:pt-0'}
          lg:pl-[clamp(80px,calc(100vw*(100/1440)),150px)]
        `}
      >
        <Outlet />
        <FormFooter />
        </div>

        <div
          className="
            hidden
            relative
            lg:block
            lg:w-[779px]
            lg:min-h-screen
          "
        >
          <img
            src="/frontPicture.jpg"
            alt="Front visual"
            className="w-full h-full object-cover"
          />

          <img
            src="/logo-l.png"
            alt="logo"
            className="
              absolute
              top-[390px]
              left-1/2
              -translate-x-1/2
              w-auto
              h-auto
              object-contain
  "
          />

          <div
    className="
      absolute
      bottom-[40px]
      right-[100px]
      text-white
      text-right
    "
  >
    <p className="font-medium text-l">© 2023 Verify. All Rights Reserved.</p>
  </div>

        </div>
      </main>
  );
};
