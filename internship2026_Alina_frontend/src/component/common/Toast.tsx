import { ToastState } from '../../type/ToastInterface';

interface ToastProps {
  toast: ToastState | null;
}

export const Toast = ({ toast }: ToastProps) => {
  if (!toast) return null;

  return (
    <div
      className={`fixed top-[100px] right-[30px] z-50 flex items-center justify-start px-4 shadow-lg border border-l-[6px] transition-all duration-200 w-[311px] h-[60px] lg:w-[550px] text-bg-main text-l ${
        toast.type === 'success'
        ? 'bg-accent-hover border-accent'
        : toast.type === 'warning'
        ? 'bg-warning border-warning'
        : 'bg-error-soft border-error-bold'
    }`}
  >
      {toast.message}
    </div>
  );
};
