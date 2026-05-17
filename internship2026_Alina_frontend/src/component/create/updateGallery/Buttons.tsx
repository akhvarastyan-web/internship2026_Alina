import React from 'react';

interface ButtonsProps {
  cancelText?: string;
  onCancel?: () => void;
  isCancelDisabled?: boolean; // Новий необов'язковий проп

  submitText: string;
  onSubmit: () => void;
  isSubmitDisabled?: boolean;
}

export const Buttons: React.FC<ButtonsProps> = ({
  cancelText = 'Delete',
  onCancel,
  isCancelDisabled = false, // Значення за замовчуванням
  submitText,
  onSubmit,
  isSubmitDisabled = false,
}) => {
  return (
    <div className="lg:fixed lg:w-[820px] lg:h-[90px] z-[100] bottom-0 right-0 bg-bg-main">
      <div className="flex flex-col lg:flex-row lg:justify-end gap-4 px-[30px] pt-5">

        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            disabled={isCancelDisabled} // Додано атрибут disabled
            className="text-l bg-bg-main text-accent lg:w-[250px] h-[50px] rounded-2xl hover:bg-gray-300 disabled:bg-button-disabled disabled:opacity-50 transition-colors"
          >
            {cancelText}
          </button>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={isSubmitDisabled}
          className="text-l bg-accent text-bg-main lg:w-[250px] h-[50px] rounded-2xl hover:bg-accent-hover disabled:bg-button-disabled transition-colors"
        >
          {submitText}
        </button>

      </div>
    </div>
  );
};
