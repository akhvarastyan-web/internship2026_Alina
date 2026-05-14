import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField } from '../common/InputField';
import { validate } from '../../utils/validations/validation';
import { FormErrors } from '../../type/FormErrors';
import { FormValues } from '../../type/FormValues';
import { handleChange } from '../../utils/handleChange';
import { Button } from '../common/Button';
import { Square, CheckSquare } from 'lucide-react';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { useAuthMutations } from '../../utils/mutations/useAuthMutations';
import { useFormFilled } from '../../hooks/useFormFilled';
import { FormWrapper } from '../common/FormWrapper';
import { LargeHeader } from '../common/Headers';

export const SignUpForm = () => {
  const [error, setError] = useState<FormErrors>({});
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);
  const [values, setValues] = useState<FormValues>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const {
    registerMutation: { mutate, isPending },
  } = useAuthMutations();

  const isFormFilled = useFormFilled(values);

  const toggleKeepLoggedIn = () => {
    setKeepLoggedIn(prev => !prev);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    setError({});

    const { confirmPassword, ...registerData } = values;

    mutate(
      {
        registerData,
        keepLoggedIn,
      },
      {
        onError: err => {
          if (err instanceof Error) {
            setError({
              api: err.message,
            });
          }
        },
      },
    );
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  return (
    <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
      <LargeHeader>Sign Up</LargeHeader>

      <div className="mb-[clamp(16px,calc(100vw*(20/375)),24px)]">
        <span
          className="
              text-[clamp(13px,calc(100vw*(14/375)),16px)]
              font-semibold
              border-b-2
              border-accent-hover
              pb-1
            "
        >
          Personal information
        </span>
      </div>

      <InputField
        id="firstname"
        label="First Name"
        placeholder="Enter your first name"
        value={values.firstname}
        onChange={onInputChange}
        error={error.firstname}
      />
      <InputField
        id="lastname"
        label="Last Name"
        placeholder="Enter your last name"
        value={values.lastname}
        onChange={onInputChange}
        error={error.lastname}
      />
      <InputField
        id="email"
        type="email"
        label="Email"
        placeholder="example@mail.com"
        value={values.email}
        onChange={onInputChange}
        error={error.email}
      />
      <InputField
        id="password"
        type="password"
        label="Password"
        placeholder="Minimum 8 characters"
        value={values.password}
        onChange={onInputChange}
        error={error.password}
      />
      <InputField
        id="confirmPassword"
        type="password"
        label="Confirm Password"
        placeholder="Repeat your password"
        value={values.confirmPassword}
        onChange={onInputChange}
        error={error.confirmPassword}
      />

      <PasswordChecklist
        value={values.password}
        confirmValue={values.confirmPassword}
      />

      <div className="flex justify-between items-center">
        <div
          role="checkbox"
          aria-checked={keepLoggedIn}
          tabIndex={0}
          onClick={toggleKeepLoggedIn}
          className="flex items-center gap-2 cursor-pointer select-none
            focus-visible:ring-2 focus-visible:ring-accent
            rounded-sm outline-none"
          onKeyDown={event => {
            if (event.key === ' ' || event.key === 'Enter') {
              event.preventDefault();
              toggleKeepLoggedIn();
            }
          }}
        >
          {keepLoggedIn ? (
            <CheckSquare className="check-box-icon text-accent" />
          ) : (
            <Square className="check-box-icon text-text-secondary" />
          )}

          <p className="text-s text-text-secondary">Keep me logged in</p>
        </div>
      </div>

      {error.api && (
        <div className="text-error-DEFAULT text-s text-center">{error.api}</div>
      )}

      <p className="text-s text-text-secondary">
        By registering you agree to{' '}
        <Link
          to="/terms"
          className="text-accent-hover font-medium hover:underline"
        >
          Terms and Conditions
        </Link>{' '}
        and{' '}
        <Link
          to="/privacy"
          className="text-accent-hover font-medium hover:underline"
        >
          Privacy Policy
        </Link>
      </p>

      <Button
        text="Continue"
        isLoading={isPending}
        disabled={!isFormFilled || isPending}
      />

      <p className="text-s text-center text-text-secondary">
        Already have an account?{' '}
        <Link
          to="/auth/signin"
          className="text-accent-hover font-medium hover:underline"
        >
          Sign In
        </Link>
      </p>
    </FormWrapper>
  );
};
