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
        className="bg-white rounded-lg p-6 shadow-xl flex flex-col justify-between items-center text-center
          w-[343px] h-[298px]
          lg:w-[398px] lg:h-[298px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        {!isDeletedSuccess ? (
          <>
            <div className="flex-1 flex flex-col justify-center gap-2">
              <h3 className="text-lg font-bold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-500">{description}</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
              <button
                disabled={isDeleting}
                onClick={onConfirm}
                className="flex-1 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded text-sm font-semibold transition-colors disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
              <button
                disabled={isDeleting}
                onClick={onClose}
                className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-semibold transition-colors"
              >
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <div className="flex-1 flex flex-col justify-center items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl font-bold mb-2">
                ✓
              </div>
              <h3 className="text-lg font-bold text-gray-900">Deleted!</h3>
              <p className="text-sm text-gray-500">The item has been successfully removed.</p>
            </div>

            <button
              onClick={onClose}
              className="w-full py-2.5 bg-gray-900 hover:bg-gray-800 text-white rounded text-sm font-semibold transition-colors"
            >
              Close
            </button>
          </>
        )}
      </div>
    </div>
  );
};
