import { MouseEvent } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string;
  type?: 'success';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  description,
  type = 'success',
  onClose,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-bg-main rounded-2xl p-6 shadow-xl flex flex-col justify-between items-center text-center
          w-[343px] h-[260px]
          lg:w-[398px] lg:h-[260px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >

        <h3 className="text-xl">{title}</h3>
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          {type === 'success' && (
            <div className="w-12 h-12 rounded-full bg-accent text-bg-main flex items-center justify-center text-xl mb-1">
              ✓
            </div>
          )}

          <p className="text-text-secondary">{description}</p>
        </div>

      </div>
    </div>
  );
};
