import { MouseEvent } from 'react';

interface DeleteModalProps {
  isOpen: boolean;
  isDeleting: boolean;
  isDeletedSuccess: boolean;
  title: string;
  description: string;
  onConfirm: () => void;
  onClose: () => void;
}

export const DeleteModal = ({
  isOpen,
  isDeleting,
  isDeletedSuccess,
  title,
  description,
  onConfirm,
  onClose,
}: DeleteModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl p-4 shadow-xl flex flex-col justify-between items-center text-center
          w-[343px] h-[298px]
          lg:w-[398px] lg:h-[298px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        {!isDeletedSuccess ? (
          <>
            <div className="flex-1 flex flex-col justify-center gap-4">
              <h3 className="text-xl">{title}</h3>
              <p className="text-text-secondary">{description}</p>
            </div>

            <div className="flex flex-col gap-1 w-[250px]">
              <button
                disabled={isDeleting}
                onClick={onConfirm}
                className="flex-1 h-[50px] py-2.5 bg-error hover:bg-error-soft text-bg-main rounded-2xl font-bold transition-colors"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                disabled={isDeleting}
                onClick={onClose}
                className="flex-1 h-[50px] py-2.5 bg-bg-main hover:bg-gray-200 rounded-2xl font-bold transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="relative w-[343px] h-[298px]
          lg:w-[398px] lg:h-[298px] flex-1 flex flex-col justify-center items-center gap-2">
               <button
              onClick={onClose}
              className="absolute w-3 h-3 top-0 right-3 rounded text-l transition-colors"
            >
              X
            </button>
              <h3 className="text-l font-bold text-gray-900">Deleted!</h3>
               <div className="w-12 h-12 rounded-full bg-accent text-bg-main flex items-center justify-center text-xl font-bold mb-2">
                ✓
              </div>
              <p className="text-text-secondary">The item has been successfully removed.</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
