import { useEffect } from 'react';
import { GalleryErrors } from './validations/validateGallery';

export const useFieldAutoReset = (
  errorKey: keyof GalleryErrors,
  setValue: (v: string) => void,
  setErrors: React.Dispatch<React.SetStateAction<GalleryErrors>>,
  errors: GalleryErrors,
) => {
  useEffect(() => {
    if (!errors[errorKey]) return;

    const timer = setTimeout(() => {
      setValue('');
      setErrors(prev => ({ ...prev, [errorKey]: undefined }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [errors[errorKey]]);

  return (value: string) => {
    setValue(value);
    setErrors(prev => ({ ...prev, [errorKey]: undefined }));
  };
};
