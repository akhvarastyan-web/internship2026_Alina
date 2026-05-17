import { ChangeEvent, Dispatch, SetStateAction } from 'react';
import { PhotoItem } from '../type/PhotoItem';
import { useToast } from './useToast';

interface UseFileHandlerProps {
  setPhotos: Dispatch<SetStateAction<PhotoItem[]>>;
}

export const useFileHandler = ({ setPhotos }: UseFileHandlerProps) => {
  const { showToast } = useToast();

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    if (e.target.files.length > 50) {
      showToast('Warning! Cannot upload more than 50 photos.', 'warning');
      return;
    }

    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    const filesArray = Array.from(e.target.files);

    const hasLargeFile = filesArray.some(file => file.size > MAX_FILE_SIZE);

    if (hasLargeFile) {
      showToast('Warning. The size of each photo must not exceed 5MB', 'warning');
      return;
    }

    const newPhotos: PhotoItem[] = filesArray.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      title: '',
      description: '',
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  return { handleFileChange };
};
