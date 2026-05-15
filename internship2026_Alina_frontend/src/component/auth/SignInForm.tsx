import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField } from '../common/InputField';
import { FormErrors } from '../../type/FormErrors';
import { handleChange } from '../../utils/handleChange';
import { Button } from '../common/Button';
import { useFormFilled } from '../../hooks/useFormFilled';
import { FormWrapper } from '../common/FormWrapper';
import { LargeHeader } from '../common/Headers';
import { useLoginMutation } from '../../store/api/authApi';
import { setCredentials } from '../../store/slices/auth/auth.slice';
import { useAppDispatch } from '../../hooks/redux';

export const SignInForm = () => {
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useAppDispatch();

  const isFormFilled = useFormFilled(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    try {
      const result = await login({
        email: values.email,
        password: values.password,
      }).unwrap();



      dispatch(setCredentials({ accessToken: result.access_token }));

  } catch (err: any) {
    const errorMessage = err.data?.message || err.message || 'Login failed';
      setError({ api: errorMessage });
  }
};

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  return (
    <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
      <div
        className="
        flex flex-col gap-form-small"
      >
        <LargeHeader>Sign In</LargeHeader>

        <p
          className="
              text-l
              font-400
              text-text-secondary
            "
        >
          Enter your email and password to sign in!
        </p>
      </div>

      <div
        className="
        flex flex-col gap-form"
      >
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

        <div
          className="
        flex justify-between items-center"
        >

          <div>
            <p className="text-s text-text-secondary">
              <Link
                to="/auth/forgot-password"
                className="text-accent-hover hover:underline"
              >
                Forgot password?
              </Link>
            </p>
          </div>
        </div>

        <Button
          text="Sign in"
          isLoading={isLoading}
          disabled={!isFormFilled || isLoading}
        />

        <p className="text-s text-center text-text-secondary">
          Not registered yet?{' '}
          <Link
            to="/auth/signup"
            className="text-accent-hover font-medium hover:underline"
          >
            Create an Account
          </Link>
        </p>
      </div>
    </FormWrapper>
  );
};
