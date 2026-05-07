import { FormErrors } from '../type/FormErrors';
import { FormValues } from '../type/FormValues';

const nameRegex = /^[^\d]{2,50}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function validate(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!nameRegex.test(values.firstname)) {
    errors.firstname = 'First name must be 2–50 characters and contain no numbers.';
  }

  if (!nameRegex.test(values.lastname)) {
    errors.lastname = 'Last name must be 2–50 characters and contain no numbers.';
  }

  if (!emailRegex.test(values.email)) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!passwordRegex.test(values.password)) {
    errors.password =
      'Password must be at least 8 characters and include an uppercase letter, a lowercase letter, and a number.';
  }

  if (values.confirmPassword !== values.password) {
    errors.confirmPassword = 'Passwords do not match.';
  }

  return errors;
}
