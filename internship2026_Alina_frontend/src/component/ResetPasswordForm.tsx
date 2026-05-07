import * as React from 'react';
import { useState } from 'react';
import '../index.css';
import { useNavigate } from 'react-router-dom';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { Loader2 } from 'lucide-react';
import { handleChange } from '../utils/handleChange';
import { validateResetPassword } from '../utils/passwordValidation';
import { useSearchParams } from 'react-router-dom';



export const ResetPasswordForm = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

   const [error, setError] = useState<FormErrors>({});
   const [isLoading, setIsLoading] = useState(false);
   const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });

   const isFormFilled = Object.values(values).every(value => value.trim().length > 0);

  const isButtonDisabled = !isFormFilled || isLoading;



const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    const validationErrors = validateResetPassword(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

    return;
  }

  setIsLoading(true);

    try {
      const response = await fetch('API_URL/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          password: values.password,
          token: token,
        }),
      });


      if (!response.ok) {
        throw new Error('Link expired or invalid token');
      }

      navigate('/auth/password-saved');

    } catch (err: any) {
      setError({ api: err.message });
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
        flex flex-col gap-form-large
        w-[clamp(280px,calc(100vw*(343/375)),400px)]
        lg:w-[clamp(320px,calc(100vw*(411/1440)),480px)]
        "
        >


        <h1
          className="
            text-center
            font-bold
            text-[clamp(24px,calc(100vw*(28/375)),32px)]
             lg:text-left
          "
        >
          Set New Password
        </h1>


        <div className="
        flex flex-col gap-form">

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

          <button
              type="submit"
              disabled={isButtonDisabled}
            className={`
              height-form-elem
              w-full
              rounded-lg
              bg-accent
              text-white
              text-s
              font-bold
              transition
              ${
                isButtonDisabled
                ? 'bg-button-disabled cursor-not-allowed'
                  : 'bg-accent hover:bg-accent-hover active:bg-button-active' }
              `}
          >
            {isLoading ? (
              <Loader2 className="loader-custom " />
           ) : (
             'Reset password'
            )}
          </button>

          </div>
        </form>
  )
}
