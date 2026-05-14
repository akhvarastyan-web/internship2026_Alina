import { Square, CheckSquare } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { PasswordChecklistProps } from '../../type/PasswordChecklistProps';

export const PasswordChecklist = ({
  value,
  confirmValue,
}: PasswordChecklistProps) => {
  const checklistRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (value.length === 1) {
      checklistRef.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  }, [value.length]);

  if (value.length === 0) {
    return null;
  }

  const checks = [
    { label: 'Password has at least 8 characters', met: value.length >= 8 },
    { label: 'Password has a number', met: /\d/.test(value) },
    { label: 'Password has an uppercase letter', met: /[A-Z]/.test(value) },
    { label: 'Password has a lowercase letter', met: /[a-z]/.test(value) },
    { label: 'Passwords match', met: value !== '' && value === confirmValue },
  ];

  return (
    <ul ref={checklistRef} className="flex flex-col gap-2 mt-2 mb-2">
      {checks.map((check, index) => (
        <li
          key={index}
          className="flex items-center gap-form-small text-s transition-colors"
        >
          {check.met ? (
            <CheckSquare className="check-box-icon text-accent" />
          ) : (
            <Square className="check-box-icon text-text-secondary" />
          )}
          <span
            className={check.met ? 'text-text-primary' : 'text-text-secondary'}
          >
            {check.label}
          </span>
        </li>
      ))}
    </ul>
  );
};
