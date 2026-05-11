import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { InputField } from './common/InputField';
import { FormErrors } from '../type/FormErrors';
import { X } from 'lucide-react';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';
import { useAuthMutations } from '../utils/mutations/useAuthMutations';
import { useFormFilled } from '../hooks/useFormFilled';
import { FormWrapper } from './common/FormWrapper';
import { LargeHeader } from './common/Headers';


export const ForgotPasswordForm = () => {
  const navigate = useNavigate();
   const [error, setError] = useState<FormErrors>({});
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [values, setValues] = useState({
    email: '',
  });

  const {
    forgotPasswordMutation: { mutate, isPending },
  } = useAuthMutations();

  const isFormFilled = useFormFilled(values);

const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  setError({});

  mutate(values.email, {
    onSuccess: () => {
      setIsModalOpen(true);
    },

    onError: (err) => {
      if (err instanceof Error) {
        setError({ email: err.message });
      }
    },
  });
};

const closeModalAndNavigate = () => {
    setIsModalOpen(false);
    navigate('/auth/signin');
  };


  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  return (
    <>
     <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
        <div className="
        flex flex-col gap-form-small" >

        <LargeHeader>Forgot Password?</LargeHeader>

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
            isLoading={isPending}
            disabled={!isFormFilled || isPending}
           />

          </div>
        </FormWrapper>

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
        onClick={closeModalAndNavigate}
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
