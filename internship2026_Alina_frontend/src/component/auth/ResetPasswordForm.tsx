import { useState } from 'react';
import { InputField } from '../common/InputField';
import { FormErrors } from '../../type/FormErrors';
import { handleChange } from '../../utils/handleChange';
import { useNavigate } from 'react-router-dom';
import { validateResetPassword } from '../../utils/validations/passwordValidation';
import { useSearchParams } from 'react-router-dom';
import { Button } from '../common/Button';
import { useFormFilled } from '../../hooks/useFormFilled';
import { FormWrapper } from '../common/FormWrapper';
import { PasswordChecklist } from '../common/PasswordChecklist';
import { LargeHeader } from '../common/Headers';
import { useResetPasswordMutation } from '../../store/api/authApi';

export const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token') || '';
  const [error, setError] = useState<FormErrors>({});
  const [values, setValues] = useState({
    password: '',
    confirmPassword: '',
  });
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const navigate = useNavigate();

  const isFormFilled = useFormFilled(values);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateResetPassword(values);

    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);

      return;
    }

    setError({});

    try {
      await resetPassword({ password: values.password, token }).unwrap();
      navigate('/auth/password-saved');
    } catch (err: any) {
      const apiErrorMessage =
        err?.data?.message || err?.message || 'Something went wrong';

      setError({ api: apiErrorMessage });
    }
  };

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleChange(e, setValues, setError, error);
  };

  return (
    <FormWrapper onSubmit={handleSubmit} className="gap-form-large">
      <LargeHeader>Set New Password</LargeHeader>

      <div
        className="
        flex flex-col gap-form"
      >
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

        <PasswordChecklist
          value={values.password}
          confirmValue={values.confirmPassword}
        />

        <Button
          text="Save"
          isLoading={isLoading}
          disabled={!isFormFilled || isLoading}
        />
      </div>
    </FormWrapper>
  );
};
