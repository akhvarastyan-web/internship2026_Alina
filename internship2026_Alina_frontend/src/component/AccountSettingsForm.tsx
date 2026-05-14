import { FormWrapper } from './common/FormWrapper';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';
import { useState } from 'react';
import { FormErrors } from '../type/FormErrors';
import { FormValues } from '../type/FormValues';
import { InputField } from './common/InputField';
import { useAuthMutations } from '../utils/mutations/useAuthMutations';
import { validate } from '../utils/validations/validation';
import { useFormFilled } from '../hooks/useFormFilled';
import { Header } from './common/Headers';

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const AccountSettingsForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState<FormValues>({
    firstname: '',
    lastname: '',
  });

  const {
    changeNameMutation: { mutate, isPending },
  } = useAuthMutations();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  const isFormFilled = useFormFilled(values);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validate(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    mutate(values, {
      onSuccess: () => {
        onSuccess();
      },
      onError: error => {
        console.error('Submission failed:', error);
      },
    });
  };

  return (
    <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
      <div
        className="
        flex flex-col gap-form-small"
      >
        <Header>Acccount settings</Header>

        <p
          className="
              font-400
              text-text-secondary
            "
        >
          Here you can change your account information,
        </p>
      </div>

      <div
        className="
        flex flex-col gap-form"
      >
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

        <Button
          text="Save changes"
          isLoading={isPending}
          disabled={!isFormFilled || isPending}
        />
      </div>
    </FormWrapper>
  );
};
