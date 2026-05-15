import { FormWrapper } from './common/FormWrapper';
import { handleChange } from '../utils/handleChange';
import { Button } from './common/Button';
import { useState } from 'react';
import { FormErrors } from '../type/FormErrors';
import { PasswordFormValues } from '../type/FormValues';
import { InputField } from './common/InputField';
import { validate } from '../utils/validations/validation';
import { useFormFilled } from '../hooks/useFormFilled';
import { PasswordChecklist } from './common/PasswordChecklist';
import { Header } from './common/Headers';
import { useChangePasswordMutation } from '../store/api/authApi';

interface ChangePasswordFormProps {
  onSuccess: () => void;
}

export const ChangePasswordForm = ({ onSuccess }: ChangePasswordFormProps) => {
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState<PasswordFormValues>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [changePassword, { isLoading }] = useChangePasswordMutation();

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  const isFormFilled = useFormFilled(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError({});

    const newErrors: FormErrors = {};

    if (!values.oldPassword) {
      newErrors.oldPassword = 'Please enter your current password';
    }

    const newPasswordErrors = validate({
      newPassword: values.newPassword,
      confirmPassword: values.confirmPassword,
    } as any);

    const allErrors = { ...newErrors, ...newPasswordErrors };

    if (Object.keys(allErrors).length > 0) {
      setError(allErrors);
      return;
    }

    try {
      await changePassword({
        oldPassword: values.oldPassword,
        newPassword: values.newPassword,
      }).unwrap();

      onSuccess();
      setValues({ oldPassword: '', newPassword: '', confirmPassword: '' });

    } catch (err: any) {
      const apiErrorMessage = err?.data?.message || err?.message || 'Something went wrong';

      setError({ oldPassword: apiErrorMessage });
    }
  };

  return (
    <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
      <div
        className="
        flex flex-col gap-form-small"
      >
        <Header>Change Password</Header>
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
          id="oldPassword"
          type="password"
          label="Old password"
          placeholder="Enter current password"
          value={values.oldPassword}
          onChange={onInputChange}
          error={error.oldPassword}
        />

        <InputField
          id="newPassword"
          type="password"
          label="New password"
          placeholder="Minimum 8 characters"
          value={values.newPassword}
          onChange={onInputChange}
          error={error.newPassword}
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

        <PasswordChecklist
          value={values.newPassword}
          confirmValue={values.confirmPassword}
        />

        <Button
          text="Save changes"
          isLoading={isLoading}
          disabled={!isFormFilled || isLoading}
        />
      </div>
    </FormWrapper>
  );
};
