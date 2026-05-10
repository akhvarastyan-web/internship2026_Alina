import { useNavigate } from 'react-router-dom';
import { FormWrapper } from './common/FormWrapper';


export const PasswordSavedForm = () => {
const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/signin');
  };


  return (
     <FormWrapper onSubmit={handleSubmit} className="gap-form-large">

        <div className="
        flex flex-col gap-form-small " >

        <h1
          className="
            text-center
            font-bold
            text-[clamp(24px,calc(100vw*(28/375)),32px)]

          "
        >
          New password has been saved
        </h1>

          <p
            className="
              text-center
              font-400
              text-text-secondary
            "
          >
            Now you can sign in with new password.
          </p>


        </div>

        <div className="
        flex flex-col gap-form">

          <button
              type="submit"
            className="
              height-form-elem
              w-full
              rounded-lg
              bg-accent
              text-white
              text-s
              font-bold
              transition
              hover:bg-accent-hover
              active:bg-button-active"
          >

             Sign in
          </button>

          </div>
        </FormWrapper>
  )
}
