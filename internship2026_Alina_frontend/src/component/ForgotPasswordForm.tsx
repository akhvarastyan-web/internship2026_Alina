import * as React from 'react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { X } from 'lucide-react';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';



export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
   const [error, setError] = useState<FormErrors>({});
   const [isLoading, setIsLoading] = useState(false);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [values, setValues] = useState({
    email: '',
  });

   const isFormFilled = Object.values(values).every(value => value.trim().length > 0);




const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError({});
  setIsLoading(true);

  try {
    const response = await fetch('API_URL/forgot-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: values.email }),
    });

    if (!response.ok) {
      throw new Error('Error! Please check the entered information');
    }

    setIsModalOpen(true);
  } catch (err: any) {
    setError({ email: err.message });
  } finally {
    setIsLoading(false);
  }
};

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  return (
    <>
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
          Forgot Password?
        </h1>

          <p
            className="
              text-l
              font-400
              text-text-secondary
            "
          >
            Just let us know your email address and we'll email you a password reset link that will allow you to choose a new one.
          </p>


        </div>

        <div className="
        flex flex-col gap-form" >

           <InputField
            id="email"
            type="email"
            label="Email"
            placeholder="example@mail.com"
            value={values.email}
             onChange={onInputChange}
            error={error.email}
          />

          <Button
            text="Reset"
            isLoading={isLoading}
            disabled={!isFormFilled}
           />

          </div>
        </form>
      {isModalOpen && (
      <div className="
      fixed inset-0 z-[100]
      flex items-center
      justify-center
      bg-black/70
      backdrop-blur-sm" >
        <div
           onClick={() => {
      setIsModalOpen(false);
      navigate('/auth/signin');
    }}
          className="relative bg-bg-main rounded-2xl flex flex-col items-center justify-center p-8 shadow-xl
          w-[75vw] h-auto aspect-square lg:check-email-message-l "
        >
          <h2 className="mb-4">Check your email</h2>
          <p className="text-center text-text-secondary mb-8">
            A link has been sent to your email, please check.
          </p>
          <button
        onClick={() => {
          setIsModalOpen(false);
          navigate('/auth/signin');
        }}
        className="
          absolute top-6 right-6
          text-text-secondary hover:text-accent
          cursor-pointer
        "
        aria-label="Close"
      >
        <X size={24} />
      </button>
        </div>
      </div>
      )}
    </>
  )
}
