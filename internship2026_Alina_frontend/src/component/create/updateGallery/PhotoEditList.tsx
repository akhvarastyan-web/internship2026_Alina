import { X } from 'lucide-react';
import { GalleryFormFields } from './GalleryFormFields';
import { UploadedPhoto } from '../../../type/UploadedPhoto';
import { GalleryErrors } from '../../../utils/validations/validateGallery';

interface PhotoEditListProps {
  photos: UploadedPhoto[];
  handleInputChange: (
    id: string | number,
    field: 'title' | 'description',
    value: string,
  ) => void;
  onDeletePhoto?: (id: string | number) => void;
  isDeleteDisabled?: boolean;
  errors?: GalleryErrors;
}

export const PhotoEditList: React.FC<PhotoEditListProps> = ({
  photos,
  handleInputChange,
  onDeletePhoto,
  isDeleteDisabled = false,
  errors,
}) => {
  return (
    <div className="flex-1 flex flex-col gap-5 overflow-y-auto">
      {photos.map(photo => (
        <div
          key={photo.id}
          className="flex flex-col lg:flex-row gap-5 bg-white shadow-sm justify-center"
        >
          <div className="w-[311px] lg:w-[232px] h-[311px] lg:h-[232px] rounded-2xl shrink-0 overflow-hidden bg-bg-soft relative">
            <img src={photo.previewUrl} alt="Preview" className="w-full h-full object-cover" />

            {onDeletePhoto && (
              <button
                type="button"
                onClick={() => onDeletePhoto(photo.id)}
                disabled={isDeleteDisabled}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 disabled:bg-button-disabled disabled:text-text-secondary disabled:cursor-not-allowed transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <div className="flex flex-col gap-3 flex-1">
            <GalleryFormFields
              nameValue={photo.title}
              onNameChange={(value) => handleInputChange(photo.id, 'title', value)}
              descriptionValue={photo.description}
              onDescriptionChange={(value) => handleInputChange(photo.id, 'description', value)}
              nameLabel="Name"
              namePlaceholder="Name"
              descriptionLabel="Comment"
              descriptionPlaceholder="Type here..."
              isDescriptionOptional={false}
              errors={errors?.photos?.[photo.id]}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

