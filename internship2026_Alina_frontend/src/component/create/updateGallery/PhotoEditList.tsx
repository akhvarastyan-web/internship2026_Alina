import { X } from 'lucide-react';
import { GalleryFormFields } from './GalleryFormFields';
import { UploadedPhoto } from '../../../type/UploadedPhoto';
import { GalleryErrors } from '../../../utils/validations/validateGallery';
import { usePhotoFieldAutoReset } from '../../../utils/usePhotoFieldAutoReset';


interface PhotoEditListProps {
  photos: UploadedPhoto[];
  setPhotos: React.Dispatch<React.SetStateAction<PhotoItem[]>>;
  setErrors: React.Dispatch<React.SetStateAction<GalleryErrors>>;
  onDeletePhoto?: (id: string | number) => void;
  isDeleteDisabled?: boolean;
  errors?: GalleryErrors;
}


const PhotoEditItem = ({ photo, errors, setErrors, setPhotos, onDeletePhoto, isDeleteDisabled }) => {
  const handleTitleChange = usePhotoFieldAutoReset(
    photo.id, 'title',
    (v) => setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, title: v } : p)),
    setErrors, errors,
  );

  const handleDescriptionChange = usePhotoFieldAutoReset(
    photo.id, 'description',
    (v) => setPhotos(prev => prev.map(p => p.id === photo.id ? { ...p, description: v } : p)),
    setErrors, errors,
  );

  return (
    <div className="flex flex-col lg:flex-row gap-5 bg-white shadow-sm justify-center">
      <div className="w-[311px] lg:w-[232px] h-[311px] lg:h-[232px] rounded-2xl shrink-0 overflow-hidden bg-bg-soft relative">
        <img src={photo.previewUrl} alt="Preview" className="w-full h-full object-cover" />
        {onDeletePhoto && (
          <button type="button" onClick={() => onDeletePhoto(photo.id)} disabled={isDeleteDisabled}
            className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:bg-button-disabled disabled:cursor-not-allowed transition-colors">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
      <div className="flex flex-col gap-3 flex-1">
        <GalleryFormFields
          nameValue={photo.title}
          onNameChange={handleTitleChange}
          descriptionValue={photo.description}
          onDescriptionChange={handleDescriptionChange}
          nameLabel="Name"
          namePlaceholder="Name"
          descriptionLabel="Comment"
          descriptionPlaceholder="Type here..."
          isDescriptionOptional={false}
          errors={errors?.photos?.[photo.id]}
        />
      </div>
    </div>
  );
};

export const PhotoEditList: React.FC<PhotoEditListProps> = ({
  photos,
  setPhotos,
   errors = {},
  setErrors,
  onDeletePhoto,
  isDeleteDisabled = false,
}) =>{
  return (
    <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
      {photos.map(photo => (
        <PhotoEditItem
          key={photo.id}
          photo={photo}
          errors={errors}
          setErrors={setErrors}
          setPhotos={setPhotos}
          onDeletePhoto={onDeletePhoto}
          isDeleteDisabled={isDeleteDisabled}
        />
      ))}
    </div>
  );
};
