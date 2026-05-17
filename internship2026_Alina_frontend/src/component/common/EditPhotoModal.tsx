import { useState, useEffect, MouseEvent } from 'react';

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

  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setComment(initialComment);
    }
  }, [isOpen, initialName, initialComment]);

  if (!isOpen) return null;

  const hasChanges = name !== initialName || comment !== initialComment;

  const handleCloseClick = () => {
    onAttemptClose(hasChanges);
  };

  const handleSubmit = async (e: MouseEvent) => {
    e.preventDefault();
    await onSave({ name, comment });
  };

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleCloseClick}
    >
      <div
        className="bg-white rounded-lg p-6 shadow-xl flex flex-col justify-between items-stretch text-left
          w-[343px] h-[578px]
          lg:w-[398px] lg:h-[578px]"
        onClick={(e: MouseEvent) => e.stopPropagation()}
      >
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-bold text-gray-900">Edit Photo Details</h3>
          <p className="text-sm text-gray-500">Update the name and description for this photo.</p>
        </div>

        <div className="flex flex-col gap-4 flex-1 mt-5">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter photo name"
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="w-full lg:w-[318px] min-h-[196px] h-auto flex flex-col gap-1.5 p-0 bg-transparent">
            <label className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Comment</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Leave a description or comment..."
              className="w-full flex-1 min-h-[160px] p-3 border border-gray-300 rounded text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2.5 w-full mt-4">
          <button
            disabled={isUpdating || !name.trim()}
            onClick={handleSubmit}
            className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded text-sm font-semibold transition-colors disabled:opacity-50"
          >
            {isUpdating ? 'Saving changes...' : 'Save changes'}
          </button>
          <button
            disabled={isUpdating}
            onClick={handleCloseClick}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
