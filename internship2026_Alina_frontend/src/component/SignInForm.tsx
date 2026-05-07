import * as React from 'react';
import { useState } from 'react';
import '../index.css';
import { Link, useNavigate } from 'react-router-dom';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { Loader2, Square, CheckSquare } from 'lucide-react';
import { handleChange } from '../utils/handleChange';



export const SignInForm = () => {
  const navigate = useNavigate();
   const [error, setError] = useState<FormErrors>({});
   const [isLoading, setIsLoading] = useState(false);
   const [values, setValues] = useState({
    email: '',
    password: '',
  });

   const isFormFilled = Object.values(values).every(value => value.trim().length > 0);

  const isButtonDisabled = !isFormFilled || isLoading;
  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

const toggleKeepLoggedIn = () => {
  setKeepLoggedIn(prev => !prev);
};

const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});
    setIsLoading(true);

  try {
    const response = await fetch('API_URL/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: values.email,
        password: values.password
      }),
    });

    const data = await response.json();

    if (!response.ok) {

      throw new Error(data.message || 'Something went wrong');
    }


    if (keepLoggedIn) {
      localStorage.setItem('token', data.token);
    } else {
      sessionStorage.setItem('token', data.token);
    }

    navigate('/');

  } catch (err: any) {
    setError({ api: err.message || 'Network error' });
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
        ">

        <div className="
        flex flex-col gap-form-small" >

        <h1
          className="
            text-center
            font-bold
            text-[clamp(24px,calc(100vw*(28/375)),32px)]
             lg:text-left
          "
        >
          Sign In
        </h1>

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

        <div className="
        flex flex-col gap-form">

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

          <div className="
        flex justify-between items-center" >
            <div
  onClick={toggleKeepLoggedIn}
  className="flex items-center gap-2 cursor-pointer select-none"
>
  {keepLoggedIn ? (
    <CheckSquare className="w-5 h-5 text-accent" />
  ) : (
    <Square className="w-5 h-5 text-text-secondary" />
  )}

  <p className="text-s text-text-secondary">
    Keep me logged in
  </p>
</div>
          <div>
          <p className="text-s text-text-secondary">
            <Link
              to="/auth/signup"
              className="text-accent-hover hover:underline"
            >
              Forget password?
            </Link>
          </p>
          </div>

          </div>

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
                  : 'bg-accent hover:bg-accent-hover active:bg-button-active'}
              `}
          >
            {isLoading ? (
              <Loader2 className="loader-custom " />
           ) : (
             'Sign In'
            )}
          </button>


          <p className="text-s text-center text-text-secondary">
            Not registred yet? {' '}
            <Link to="/auth/signup" className="text-accent-hover font-medium hover:underline">
              Create an Account
            </Link>
          </p>
          </div>
        </form>

  )
}
