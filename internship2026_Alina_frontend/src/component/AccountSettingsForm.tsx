import { FormWrapper } from './common/FormWrapper';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';
import { useState } from 'react';
import { FormErrors } from '../type/FormErrors';
import { FormValues } from '../type/FormValues';
import { InputField } from './common/InputField';
import { validateName } from '../utils/validations/nameValidation';
import { useFormFilled } from '../hooks/useFormFilled';
import { Header } from './common/Headers';
import { useChangeNameMutation } from '../store/api/authApi';

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const AccountSettingsForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState<FormValues>({
    firstname: '',
    lastname: '',
  });

  const [changeName, { isLoading }] = useChangeNameMutation();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  const isFormFilled = useFormFilled(values);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  const validationErrors = validateName(values);

  if (Object.keys(validationErrors).length > 0) {
    setError(validationErrors);
    return;
  }

  console.log('sending values:', values);

  try {
    const result = await changeName(values).unwrap();

    onSuccess();
  } catch (err: any) {
    const apiErrorMessage = err?.data?.message || err?.message || 'Something went wrong';
    setError({ api: apiErrorMessage });
  }
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
          type="submit"
          text="Save changes"
          isLoading={isLoading}
          disabled={!isFormFilled || isLoading}
        />
      </div>
    </FormWrapper>
  );
};
