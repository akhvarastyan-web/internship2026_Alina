import * as React from 'react';
import { useNavigate } from 'react-router-dom';


export const PasswordSavedForm = () => {
const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/auth/signin');
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
          New password has been saved
        </h1>

          <p
            className="
              text-l
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
              bg-accent
              hover:bg-accent-hover
              active:bg-button-active"
          >

             Sign in
          </button>

          </div>
        </form>
  )
}
