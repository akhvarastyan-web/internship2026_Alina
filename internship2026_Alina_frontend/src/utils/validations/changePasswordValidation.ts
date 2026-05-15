import { FormErrors } from '../../type/FormErrors';
import { passwordRegex } from './inputRegex';

export function validateChangePassword(values: {
  newPassword?: string;
  confirmPassword?: string;
}): FormErrors {
  const errors: FormErrors = {};

  if (!values.newPassword || !passwordRegex.test(values.newPassword)) {
    errors.newPassword =
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.';
  }

  if (values.confirmPassword !== values.newPassword) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
