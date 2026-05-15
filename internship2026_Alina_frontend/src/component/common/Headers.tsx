export const LargeHeader = ({ children }) => {
  return (
    <h1
      className={`
        text-center
            font-bold
            text-[clamp(24px,calc(100vw*(28/375)),36px)]

             lg:text-left
      `}
    >
      {children}
    </h1>
  );
};

export const Header = ({ children }) => {
  return (
    <h1
      className={`
            overflow-hidden
            font-bold
             text-[clamp(20px,calc(100vw*(24/375)),32px)]
             text-left
             w-full max-w-[343px] lg:max-w-[710px] mx-auto
      `}
    >
      {children}
    </h1>
  );
};

export const SmallHeader = ({ children }) => {
  return (
    <h1
      className={`
            overflow-hidden
            font-bold
             text-[clamp(20px,calc(100vw*(24/375)),30px)]
             text-left
             w-full max-w-[343px] lg:max-w-[710px] mx-auto
      `}
    >
      {children}
    </h1>
  );
};
