import { useState } from 'react';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { handleChange } from '../utils/handleChange';
import { validateResetPassword } from '../utils/validations/passwordValidation';
import { useSearchParams } from 'react-router-dom';
import { Button } from './common/Button';
import { useAuthMutations } from '../utils/mutations/useAuthMutations';
import { useFormFilled } from '../hooks/useFormFilled';


export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
   const [error, setError] = useState<FormErrors>({});
   const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const {
    resetPasswordMutation: { mutate, isPending },
  } = useAuthMutations();

   const isFormFilled = useFormFilled(values);


const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateResetPassword(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    setError({});

    mutate(
      { password: values.password, token },
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

          <Button
             text="Save"
             isLoading={isPending}
             disabled={!isFormFilled || isPending}
            />

          </div>
        </form>
  )
}
