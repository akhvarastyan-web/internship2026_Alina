import { GalleryErrors } from './validations/validateGallery';
import { useEffect } from 'react';

export const usePhotoFieldAutoReset = (
  photoId: string,
  field: 'title' | 'description',
  setValue: (v: string) => void,
  setErrors: React.Dispatch<React.SetStateAction<GalleryErrors>>,
  errors: GalleryErrors,
) => {
  useEffect(() => {
    if (!errors.photos?.[photoId]?.[field]) return;

    const timer = setTimeout(() => {
      setValue('');
      setErrors(prev => ({
        ...prev,
        photos: {
          ...prev.photos,
          [photoId]: { ...prev.photos?.[photoId], [field]: undefined },
        },
      }));
    }, 1000);

    return () => clearTimeout(timer);
  }, [errors.photos?.[photoId]?.[field]]);

  return (value: string) => {
    setValue(value);
    setErrors(prev => ({
      ...prev,
      photos: {
        ...prev.photos,
        [photoId]: { ...prev.photos?.[photoId], [field]: undefined },
      },
    }));
  };
};
