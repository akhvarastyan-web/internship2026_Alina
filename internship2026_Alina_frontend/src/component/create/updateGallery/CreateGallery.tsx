import { PhotoDropzone } from './PhotoDropzone';
import { PhotoEditList } from './PhotoEditList';
import { useState } from 'react';
import { useCreateGalleryMutation } from '../../../store/api/galleryApi';
import { validateGallery, GalleryErrors } from '../../../utils/validations/validateGallery';
import { PhotoItem } from '../../../type/PhotoItem';
import { useToast } from '../../../utils/useToast';
import { Toast } from '../../common/Toast';
import { GalleryFormFields } from './GalleryFormFields';
import { handleInputChange } from '../../../utils/handleInputChange';
import { useFileHandler } from '../../../utils/handleFileChange';
import { Buttons } from './Buttons';
import { useFieldAutoReset } from '../../../utils/useFieldAutoReset';


export const CreateGallery = () => {
  const [createGallery, { isLoading }] = useCreateGalleryMutation();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');
  const [errors, setErrors] = useState<GalleryErrors>({});

  const { toast, showToast } = useToast();
  const { handleFileChange } = useFileHandler({ setPhotos });


  const handleClearGallery = () => {
    photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
    setGalleryTitle('');
    setGalleryDescription('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateGallery(galleryTitle, galleryDescription, photos);

     if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      showToast('Please fix the errors in the form.', 'error');
      return;
    }

    console.log(validationErrors)

    setErrors({});

    try {
      const formData = new FormData();

      formData.append('title', galleryTitle);
      formData.append('description', galleryDescription);

      photos.forEach((photo, index) => {
        if (photo.file instanceof File) {
          formData.append('files', photo.file);
        }

        formData.append(`titles[${index}]`, photo.title);
        formData.append(`descriptions[${index}]`, photo.description);
      });

      await createGallery(formData).unwrap();

      showToast('A new gallery has been created in the gallery list.', 'success');
      handleClearGallery();

    } catch (error: any) {
      showToast('Failed to create gallery', 'error');
    }
  };

const handleTitleChange = useFieldAutoReset('title', setGalleryTitle, setErrors, errors);
const handleDescriptionChange = useFieldAutoReset('description', setGalleryDescription, setErrors, errors);

  return (
    <section className="box-border flex flex-col gap-10 relative p-[30px] lg:p-0">
    <main className="box-border mb-[90px]">
      <Toast toast={toast} />
      <div>
        <h2 className="text-xl font-bold">Create New Gallery</h2>
      </div>

      <div className="flex gap-[60px] flex-col lg:flex-row">
       <div className="flex flex-col gap-10">
        <PhotoDropzone handleFileChange={handleFileChange} />
     <GalleryFormFields
        nameValue={galleryTitle}
        onNameChange={handleTitleChange}
        descriptionValue={galleryDescription}
        onDescriptionChange={handleDescriptionChange}
        errors={errors}
    />
     </div>

    <PhotoEditList photos={photos}
  errors={errors} handleInputChange={(id, field, value) => handleInputChange(id, field, value, setPhotos, setErrors)} />
    </div>
    </main>

      {(photos.length > 0 || galleryTitle.trim()) && (
        <Buttons
  cancelText="Cancel"
  onCancel={handleClearGallery}
  submitText="Create a new gallery"
  onSubmit={handleSubmit}
  isSubmitDisabled={isLoading}
/>
      )}
    </section>
  );
};
