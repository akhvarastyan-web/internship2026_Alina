import { MouseEvent } from 'react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  confirmText: string;
  cancelText?: string; // Якщо немає кнопки Cancel, це буде просто вікно сповіщення (Success)
  type?: 'warning' | 'success';
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmationModal = ({
  isOpen,
  title,
  description,
  confirmText,
  cancelText,
  type = 'warning',
  onConfirm,
  onClose,
}: ConfirmationModalProps) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-xl flex flex-col justify-between items-center text-center
          w-[343px] h-[260px]
          lg:w-[398px] lg:h-[260px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="flex-1 flex flex-col justify-center items-center gap-2">
          {type === 'success' && (
            <div className="w-12 h-12 rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl font-bold mb-1">
              ✓
            </div>
          )}
          <h3 className="text-lg font-bold text-gray-900">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
          <button
            onClick={onConfirm}
            className={`flex-1 py-2.5 text-white rounded text-sm font-semibold transition-colors ${
              type === 'warning' ? 'bg-amber-600 hover:bg-amber-700' : 'bg-gray-900 hover:bg-gray-800'
            }`}
          >
            {confirmText}
          </button>

          {cancelText && (
            <button
              onClick={onClose}
              className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-semibold transition-colors"
            >
              {cancelText}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
