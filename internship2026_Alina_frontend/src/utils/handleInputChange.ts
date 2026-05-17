import { Dispatch, SetStateAction } from 'react';
import { PhotoItem } from '../type/PhotoItem';

export const handleInputChange = (
  id: number,
  field: 'title' | 'description',
  value: string,
  setPhotos: Dispatch<SetStateAction<PhotoItem[]>>,
) => {
  setPhotos(prevPhotos =>
    prevPhotos.map(photo =>
      photo.id === id ? { ...photo, [field]: value } : photo
    ),
  );
};
