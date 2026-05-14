import * as React from 'react';
import { FormErrors } from '../type/FormErrors';

export const handleChange = <T extends object>(
  e: React.ChangeEvent<HTMLInputElement>,
  setValues: React.Dispatch<React.SetStateAction<T>>,
  setError: React.Dispatch<React.SetStateAction<FormErrors>>,
  error: FormErrors,
) => {
  const { name, value } = e.target;

  setValues(prev => ({ ...prev, [name]: value }));

  if (error[name as keyof FormErrors]) {
    setError(prev => ({ ...prev, [name]: undefined }));
  }
};
