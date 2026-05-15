import { nameRegex } from './inputRegex';
import { FormErrors } from '../../type/FormErrors';
import { FormValues } from '../../type/FormValues';

export function validateName(values: FormValues): FormErrors {
  const errors: FormErrors = {};

  if (!nameRegex.test(values.firstname)) {
    errors.firstname =
      'First name must be 2–50 characters and contain no numbers.';
  }

  if (!nameRegex.test(values.lastname)) {
    errors.lastname =
      'Last name must be 2–50 characters and contain no numbers.';
  }

  return errors;
}
