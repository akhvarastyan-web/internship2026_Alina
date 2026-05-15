import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField } from '../common/InputField';
import { validate } from '../../utils/validations/validation';
import { FormErrors } from '../../type/FormErrors';
import { FormValues } from '../../type/FormValues';
import { handleChange } from '../../utils/handleChange';
import { Button } from '../common/Button';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { useFormFilled } from '../../hooks/useFormFilled';
import { FormWrapper } from '../common/FormWrapper';
import { LargeHeader } from '../common/Headers';
import { useRegisterMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/auth/auth.slice';
import { useAppDispatch } from '../../hooks/redux';

export const SignUpForm = () => {
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState<FormValues>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useAppDispatch();

  const isFormFilled = useFormFilled(values);


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    setError({});
    const { confirmPassword, ...registerData } = values;

    try {
      const result = await register(registerData).unwrap();

      dispatch(setCredentials({ accessToken: result.accessToken }));

    } catch (err: any) {
      setError({
        api: err.data?.message || 'Registration failed',
      });
    }
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
        isLoading={isLoading}
        disabled={!isFormFilled || isLoading}
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
