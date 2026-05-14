import { useMemo } from 'react';

export const useFormFilled = (values: Record<string, any>): boolean => {
  return useMemo(() => {
    return Object.values(values).every(value => value.toString().trim() !== '');
  }, [values]);
};
