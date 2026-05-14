interface FormWrapperProps {
  children: React.ReactNode;
  onSubmit: (e: React.FormEvent) => void;
  className?: string;
}

export const FormWrapper = ({ children, onSubmit, className = "" }: FormWrapperProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className={`
        flex flex-col gap-form-large
        w-[clamp(280px,calc(100vw*(343/375)),400px)]
        lg:w-[clamp(320px,calc(100vw*(411/1440)),480px)]
        ${className}
      `}
    >
      {children}
    </form>
  );
};
