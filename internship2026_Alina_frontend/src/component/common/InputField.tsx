import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';

interface InputFieldProps {
  id: string;
  name?: string;
  label: string;
  type?: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

export const InputField: React.FC<InputFieldProps> = ({
  id,
  name,
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const inputType = type === 'password' && showPassword ? 'text' : type;

  return (
    <div className="flex flex-col gap-[12px]">
      <label htmlFor={id}>
        {label}
        <span className="text-error">*</span>
        </label>
      <div className="relative">
      <input
        id={id}
          name={name || id}
          type={inputType}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full
          height-form-elem
          rounded-lg
          border border-input
          px-3
          outline-none
          transition
          ${
            error
            ? 'border-error ring-1 ring-error'
            : 'border-input focus:border-accent'
          }
        `}
      />

      {type === 'password' && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-text-primary focus:outline-none"
          >
            {showPassword ? (
              <Eye className="eye-icon-custom" />
            ) : (
              <EyeOff className="eye-icon-custom" />
            )}
          </button>
        )}
       </div>

      {error && (
        <p className="text-error text-s text-center">{error}</p>
      )}
      </div>
  );
};
