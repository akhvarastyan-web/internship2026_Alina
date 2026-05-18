import { PhotoEditList } from './PhotoEditList';
import { useState, useEffect } from 'react';
import { PhotoItem } from '../../../type/PhotoItem';
import { useParams } from 'react-router-dom';
import {
  useFindOneGalleryQuery,
  useFindPhotosByGalleryQuery,
  useUpdateGalleryMutation,
  useRemovePhotoMutation,
  useUpdatePhotoMutation,
} from '../../../store/api/galleryApi';
import { useToast } from '../../../utils/useToast';
import { Toast } from '../../common/Toast';
import { Buttons } from './Buttons';
import { GalleryFormFields } from './GalleryFormFields';
import { DeleteModal } from '../../common/DeleteModal';
import { useFieldAutoReset } from '../../../utils/useFieldAutoReset';
import {
  validateGallery,
  GalleryErrors,
} from '../../../utils/validations/validateGallery';

export const UpdateGallery = () => {
  const { id } = useParams<{ id: string }>();
  const galleryId = Number(id);

  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [deleteTargetId, setDeleteTargetId] = useState<number | string | null>(null);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);
  const [errors, setErrors] = useState<GalleryErrors>({});

  const { data: gallery, isLoading: isGalleryLoading } = useFindOneGalleryQuery(galleryId, { skip: !galleryId });
  const { data: photosData, isLoading: isPhotosLoading } = useFindPhotosByGalleryQuery({ galleryId }, { skip: !galleryId });
  const [updateGallery, { isLoading: isUpdating }] = useUpdateGalleryMutation();
  const [removePhoto, { isLoading: isPhotoDeleting }] = useRemovePhotoMutation()
  const [updatePhoto, { isLoading: isUploding}] = useUpdatePhotoMutation()

  const { toast, showToast } = useToast();

  const handleTitleChange = useFieldAutoReset('title', setGalleryTitle, setErrors, errors);
  const handleDescriptionChange = useFieldAutoReset('description', setGalleryDescription, setErrors, errors);


  useEffect(() => {
    if (gallery) {
      setGalleryTitle(gallery.title || '');
      setGalleryDescription(gallery.description || '');
    }
  }, [gallery]);

  useEffect(() => {
    if (photosData?.data) {
      const serverPhotos: PhotoItem[] = photosData.data.map((photo: any) => {
        const rawUrl = photo?.url || '';
        const previewUrl = rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`;

        return {
          id: photo.id,
          previewUrl,
          title: photo.title || '',
          description: photo.description || '',
        };
      });
      setPhotos(serverPhotos);
    }
  }, [photosData]);

  const openDeleteModal = (photoId: string | number) => {
    setDeleteTargetId(photoId);
    setIsDeletedSuccess(false);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setIsDeletedSuccess(false);
  };

  const handleDeletePhoto = async () => {
    if (!deleteTargetId) return;

    try {
      await removePhoto(deleteTargetId).unwrap();

      setIsDeletedSuccess(true);

      setPhotos((prevPhotos) => prevPhotos.filter((photo) => photo.id !== deleteTargetId));

      closeDeleteModal();
    } catch (err) {
      console.error('Fail:', err);
      showToast('Failed to delete photo.', 'error');
      closeDeleteModal();
    }
  };

  const handleResetGallery = () => {
    photos.forEach(photo => {
      if (typeof photo.id === 'string') URL.revokeObjectURL(photo.previewUrl);
    });

    if (gallery && photosData?.data) {
      setGalleryTitle(gallery.title || '');
      setGalleryDescription(gallery.description || '');

      const serverPhotos: PhotoItem[] = photosData.data.map((photo: any) => {
        const rawUrl = photo?.url || '';
        const previewUrl = rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`;
        return {
          id: photo.id,
          previewUrl,
          title: photo.title || '',
          description: photo.description || '',
        };
      });
      setPhotos(serverPhotos);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

    const validationErrors = validateGallery(
      galleryTitle,
      galleryDescription,
      photos,
    );

       if (Object.keys(validationErrors).length > 0) {

        setErrors(validationErrors);
        showToast('Please fix the errors in the form.', 'error');

        return;
      }

      console.log(validationErrors)

      setErrors({});

  try {

    await updateGallery({
      id: galleryId,
      body: {
        title: galleryTitle,
        description: galleryDescription,
      },
    }).unwrap();


    await Promise.all(
      photos
        .filter(photo => typeof photo.id === 'number')
        .map(photo =>
          updatePhoto({
            photoId: photo.id as number,
            body: { title: photo.title, description: photo.description },
          }).unwrap()
        )
    );

    showToast('Gallery is updated', 'success');
  } catch (error: any) {
    showToast('Error. Try again', 'error');
  }
};


  if (isGalleryLoading || isPhotosLoading) {
    return <div className="p-5 uppercase">Loading gallery data...</div>;
  }

  return (
    <section className="flex flex-col gap-10 relative p-4 ">

      <Toast toast={toast} />

      <div>
        <h2 className="text-xl font-bold">Edit Description</h2>
        <p className='text-text-secondary'>You can edit description for your gallery.</p>
      </div>

      <div className='flex flex-col lg:flex-row gap-[60px]'>
      <GalleryFormFields
        nameValue={galleryTitle}
        onNameChange={handleTitleChange}
        descriptionValue={galleryDescription}
        onDescriptionChange={handleDescriptionChange}
        errors={errors}
    />

    <PhotoEditList
          setErrors={setErrors}
          setPhotos={setPhotos}
          photos={photos}
          errors={errors}
          onDeletePhoto={openDeleteModal}
      />

      </div>
     <Buttons
  submitText="Save Changes"
  onSubmit={handleSubmit}
  isSubmitDisabled={isUpdating || !galleryTitle.trim()}
  cancelText="Cancel"
  onCancel={handleResetGallery}
/>

<DeleteModal
        isOpen={deleteTargetId !== null}
        isDeleting={isPhotoDeleting}
        isDeletedSuccess={isDeletedSuccess}
        title="Delete photos"
        description="Are you sure you want to delete photos from the gallery?"
        onConfirm={handleDeletePhoto}
        onClose={closeDeleteModal}
      />
    </section>
  );
};

