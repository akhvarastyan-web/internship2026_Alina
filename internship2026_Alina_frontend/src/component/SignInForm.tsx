import { useState } from 'react';
import { Link } from 'react-router-dom';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { Square, CheckSquare } from 'lucide-react';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';
import { useAuthMutations } from '../utils/mutations/useAuthMutations';
import { useFormFilled } from '../hooks/useFormFilled';



export const SignInForm = () => {
   const [error, setError] = useState<FormErrors>({});
   const [values, setValues] = useState({
    email: '',
    password: '',
  });
  const {
  loginMutation: { mutate, isPending },
} = useAuthMutations();

 const isFormFilled = useFormFilled(values);

  const [keepLoggedIn, setKeepLoggedIn] = useState(false);

const toggleKeepLoggedIn = () => {
  setKeepLoggedIn(prev => !prev);
};

const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    mutate(
      {
        loginData: { email: values.email, password: values.password },
        keepLoggedIn,
      },
      {
        onError: err => {
          if (err instanceof Error) {
            setError({ api: err.message });
          }
        },
      },
    );
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

  <p className="text-s text-text-secondary">
    Keep me logged in
  </p>
</div>
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
      isLoading={isPending}
      disabled={!isFormFilled || isPending}
    />


          <p className="text-s text-center text-text-secondary">
            Not registered yet? {' '}
            <Link to="/auth/signup" className="text-accent-hover font-medium hover:underline">
              Create an Account
            </Link>
          </p>
          </div>
        </form>

  )
}
