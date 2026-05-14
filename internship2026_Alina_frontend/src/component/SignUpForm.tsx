import * as React from 'react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { InputField } from './common/InputField';
import { validate } from '../utils/validation';
import { FormErrors } from '../type/FormErrors';
import { FormValues } from '../type/FormValues';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';

export const SignUpForm = () => {
  const navigate = useNavigate();
  const [error, setError] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);
  const [values, setValues] = useState<FormValues>({
    firstname: '',
    lastname: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const isFormFilled = Object.values(values).every(value => value.trim().length > 0);




  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    setIsLoading(true);
    setError({});

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(values),
      });

      const data = await response.json();


      if (!response.ok) {
        setError({
          api: data?.message || 'Something went wrong. Please try again.',
        });

        return;
      }

      if (data.access_token) {
        localStorage.setItem('token', data.access_token);
        navigate('/');
    }
  } catch {
      setError({
        api: 'Network error. Please check your connection and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      handleChange(e, setValues, setError, error);
    };

  return (
    <form
        onSubmit={handleSubmit}
        className="
        flex flex-col gap-form
        w-[clamp(280px,calc(100vw*(343/375)),400px)]
        lg:w-[clamp(320px,calc(100vw*(411/1440)),480px)]
        ">

        <h1
          className="
            text-center
            font-bold
            text-[clamp(24px,calc(100vw*(28/375)),32px)]

             lg:text-left
          "
        >
          Sign Up
        </h1>

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


          {error.api && (
               <div className="text-error-DEFAULT text-s text-center">
            {error.api}
           </div>
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
      disabled={!isFormFilled}
    />

          <p className="text-s text-center text-text-secondary">
            Already have an account?{' '}
            <Link to="/auth/signin" className="text-accent-hover font-medium hover:underline">
              Sign In
            </Link>
          </p>
        </form>

  )
}
