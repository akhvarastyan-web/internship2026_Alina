import { useState, useEffect, MouseEvent } from 'react';
import { useFieldAutoReset } from '../../utils/useFieldAutoReset';
import {
  validateGallery,
  GalleryErrors,
} from '../../utils/validations/validateGallery';

interface EditPhotoModalProps {
  isOpen: boolean;
  isUpdating: boolean;
  initialName: string;
  initialComment: string;
  onSave: (data: { name: string; comment: string }) => Promise<void>;
  onAttemptClose: (hasChanges: boolean) => void;
}

export const EditPhotoModal = ({
  isOpen,
  isUpdating,
  initialName,
  initialComment,
  onSave,
  onAttemptClose,
}: EditPhotoModalProps) => {
  const [name, setName] = useState(initialName);
  const [comment, setComment] = useState(initialComment);
  const [errors, setErrors] = useState<GalleryErrors>({});

  const handleNameChange = useFieldAutoReset('title', setName, setErrors, errors);
  const handleCommentChange = useFieldAutoReset('description', setComment, setErrors, errors);

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setComment(initialComment);
      setErrors({});
    }
  }, [isOpen, initialName, initialComment]);

  if (!isOpen) return null;

  const hasChanges = name !== initialName || comment !== initialComment;

  const handleCloseClick = () => onAttemptClose(hasChanges);

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    const validationErrors = validateGallery(name, comment);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    await onSave({ name, comment });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={handleCloseClick}>
      <div className="bg-white rounded-lg p-6 shadow-xl flex flex-col gap-[30px] justify-between items-stretch text-left w-[343px] h-[578px] lg:w-[398px] lg:h-[578px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}>
        <div className="flex flex-col gap-2">
          <h3 className="text-xl">Edit Photo Details</h3>
          <p className="text-sm text-gray-500">Update the name and description for this photo.</p>
        </div>

        <div className="flex flex-col gap-4 flex-1 mt-5">
          <div className="flex flex-col gap-1.5">
            <label className="tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="Enter photo name"
              className={`w-[318px] px-3 py-2 border rounded focus:outline-none focus:ring-1 focus:ring-accent
                ${errors.title ? 'border-error' : 'border-text-secondary'}`}
            />
            {errors.title && <span className="text-error text-xs pl-1">{errors.title}</span>}
          </div>

          <div className="min-h-[196px] h-auto flex flex-col gap-1.5 p-0 bg-transparent">
            <label className="tracking-wider">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => handleCommentChange(e.target.value)}
              placeholder="Leave a description or comment..."
              className={`w-[318px] flex-1 min-h-[160px] p-3 border rounded resize-none focus:outline-none focus:ring-1 focus:ring-accent
                ${errors.description ? 'border-error' : 'border-text-secondary/50'}`}
            />
            {errors.description && <span className="text-error text-xs pl-1">{errors.description}</span>}
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-4">
          <button disabled={isUpdating || !name.trim()} onClick={handleSubmit}
            className="w-full py-2.5 bg-accent hover:bg-accent-hover text-white rounded-2xl">
            {isUpdating ? 'Saving changes...' : 'Save changes'}
          </button>
          <button disabled={isUpdating} onClick={handleCloseClick}
            className="w-full py-2.5 bg-bg-main hover:bg-gray-200 text-accent rounded-2xl">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
