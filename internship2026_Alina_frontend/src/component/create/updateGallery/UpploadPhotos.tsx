import { PhotoDropzone } from './PhotoDropzone';
import { PhotoEditList } from './PhotoEditList';
import { useState, useEffect } from 'react';
import { PhotoItem } from '../../../type/PhotoItem';
import { useParams } from 'react-router-dom';
import {
  useFindOneGalleryQuery,
  useAddPhotoMutation,
} from '../../../store/api/galleryApi';
import { useToast } from '../../../utils/useToast';
import { handleInputChange } from '../../../utils/handleInputChange';
import { Toast } from '../../common/Toast';
import { useFileHandler } from '../../../utils/handleFileChange';
import { Buttons } from './Buttons';

export const UploadePhotos = () => {
  const { id } = useParams<{ id: string }>();
  const galleryId = Number(id);

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');

  const { data: gallery, isLoading: isGalleryLoading } = useFindOneGalleryQuery(galleryId, { skip: !galleryId });
  const [addPhoto, { isLoading: isUploading }] = useAddPhotoMutation();

  const { toast, showToast } = useToast();
  const { handleFileChange } = useFileHandler({ setPhotos });

  useEffect(() => {
    if (gallery) {
      setGalleryTitle(gallery.title || '');
      setGalleryDescription(gallery.description || '');
    }
  }, [gallery]);


  const handleResetGallery = () => {

    photos.forEach(photo => {
      if (typeof photo.id === 'string') URL.revokeObjectURL(photo.previewUrl);
    });

    setPhotos([]);
    if (gallery) {
      setGalleryTitle(gallery.title || '');
      setGalleryDescription(gallery.description || '');
    }
  };

  const handleDeleteLocalPhoto = (photoId: string | number) => {
    setPhotos(prev => {
      const target = prev.find(p => p.id === photoId);
      if (target) URL.revokeObjectURL(target.previewUrl);
      return prev.filter(p => p.id !== photoId);
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  if (photos.length === 0) {
    return;
  }

  try {
    const formData = new FormData();

    photos.forEach((photo, index) => {
      if (photo.file instanceof File) {
        formData.append('files', photo.file);
      } else if (photo.file && (photo.file as any).originFileObj instanceof File) {
        formData.append('files', (photo.file as any).originFileObj);
      }

      formData.append(`titles[${index}]`, photo.title || 'Untitled');
      formData.append(`descriptions[${index}]`, photo.description || '');
    });

    await addPhoto({ galleryId, data: formData }).unwrap();

    showToast('Success. Photos have been uploaded to your gallery.', 'success');
    setPhotos([]);

  } catch (error: any) {
    showToast('Error. Photos did not load, please try again..', 'error');
  }
};


  if (isGalleryLoading) {
    return <div className="p-5 uppercase">Loading gallery data...</div>;
  }

  return (
    <section className="flex flex-col gap-10 relative p-4 lg:p-0">
      <Toast toast={toast} />

      <div>
        <h2 className="text-xl font-bold">Upload Photos</h2>
        <p className="text-text-secondary">You can upload one photo or a set of photos.</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <PhotoDropzone handleFileChange={handleFileChange} />
        {photos.length > 0 && (
          <PhotoEditList
            photos={photos}
            handleInputChange={(id, field, value) => handleInputChange(id, field, value, setPhotos)}
            onDeletePhoto={handleDeleteLocalPhoto}
          />
        )}
      </div>


      <Buttons
        cancelText="Delete All"
        onCancel={handleResetGallery}
        submitText="Update All"
        onSubmit={handleSubmit}
        isSubmitDisabled={isUploading| !galleryTitle.trim() || photos.length === 0}
      />
    </section>
  );
};

