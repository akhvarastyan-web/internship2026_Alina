import { FormErrors } from '../../type/FormErrors';
import { passwordRegex } from './inputRegex';

export function validateResetPassword(values: {
  password?: string;
  confirmPassword?: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!values.password || !passwordRegex.test(values.password)) {
    errors.password =
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
