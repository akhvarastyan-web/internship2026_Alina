import { useNavigate } from 'react-router-dom';
import { FormWrapper } from './common/FormWrapper';
import { LargeHeader } from './common/Headers';


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

        <LargeHeader>New password has been saved</LargeHeader> 

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
