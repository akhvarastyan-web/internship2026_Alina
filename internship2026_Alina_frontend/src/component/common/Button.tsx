import { Loader2 } from 'lucide-react';
import { ButtonProps } from '../../type/ButtonProps';

export const Button = ({
  text,
  isLoading = false,
  disabled = false,
  type = 'submit',
}: ButtonProps) => {
  const isButtonDisabled = disabled || isLoading;

  return (
    <button
      type={type}
      disabled={isButtonDisabled}
      className={`
        height-form-elem
        w-full
        rounded-lg
        text-white
        text-s
        font-bold
        transition
        flex items-center justify-center
        ${
          isButtonDisabled
            ? 'bg-button-disabled cursor-not-allowed'
            : 'bg-accent hover:bg-accent-hover active:bg-button-active'
        }
      `}
    >
      {isLoading ? (
        <div className="flex justify-center items-center w-full">
          <Loader2 className="animate-spin loader-custom" />
        </div>
      ) : (
        text
      )}
    </button>
  );
};
