import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeader } from '../store/slices/dashboard/dashboardHeader.slice';
import { ContextMenu } from './common/ContextMenu';
import { DeleteModal } from './common/DeleteModal';
import { EditPhotoModal } from './common/EditPhotoModal';
import { ConfirmationModal } from './common/ConfirmationModal';
import {
  useFindPhotosByGalleryQuery,
  useFindOneGalleryQuery,
  useRemovePhotoMutation,
  useUpdatePhotoMutation,
} from '../store/api/galleryApi';

export const GalleryDetails = () => {
  const { id } = useParams<{ id: string }>();
  const galleryId = Number(id);
  const dispatch = useDispatch();
  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);
  const [editPhotoTargetId, setEditPhotoTargetId] = useState<number | null>(null);
  const [isUpdateSuccessOpen, setIsUpdateSuccessOpen] = useState(false);
  const [isDiscardWarningOpen, setIsDiscardWarningOpen] = useState(false);

   const [updatePhoto, { isLoading: isPhotoUpdating }] = useUpdatePhotoMutation();

  const [page, setPage] = useState(1);
  const itemsPerPage = 28;

  const { data: gallery, error: galleryError } = useFindOneGalleryQuery(
    galleryId,
    { skip: !galleryId },
  );

  const {
    data: photosData,
    isLoading,
    error: photosError,
  } = useFindPhotosByGalleryQuery(
    { galleryId, page, limit: itemsPerPage },
    { skip: !galleryId },
  );

  const [removePhoto, { isLoading: isPhotoDeleting }] = useRemovePhotoMutation();

  useEffect(() => {
    if (!gallery) return;
  const headerData = {
    title: 'Gallery',
    button: {
      text: 'Go to upload photos',
      link: `/upload-photos/${gallery.id}`,
    },
  };

  dispatch(setHeader(headerData));
}, [dispatch]);


  if (galleryError || photosError) {
    console.error('Error:', { galleryError, photosError });
  }

  const photos = photosData?.data || (Array.isArray(photosData) ? photosData : null) || (gallery as any)?.photos || [];
  const totalCount = photosData?.totalCount || photos.length || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentEditingPhoto = photos.find((p: any) => p?.id === editPhotoTargetId);


  const handleDeletePhoto = async () => {
    if (!deleteTargetId) return;
    try {
      await removePhoto(deleteTargetId).unwrap();
      setIsDeletedSuccess(true);
    } catch (err) {
      console.error('Fail:', err);
    }
  };

  const handleDeleteAllPhotos = async () => {
  if (!photos || photos.length === 0) return;

  const confirmDelete = window.confirm(`Are you sure you want to delete all ${photos.length} photos?`);
  if (!confirmDelete) return;

  try {
    for (const photo of photos) {
      await removePhoto(photo.id).unwrap();
    }

    setIsDeletedSuccess(true);
  } catch (err) {
    console.error('Failed to delete photos:', err);
  }
};

  const handleSavePhotoDetails = async (updatedData: { name: string; comment: string }) => {
    if (!editPhotoTargetId) return;
    try {
      await updatePhoto({
        photoId: editPhotoTargetId,
        title: updatedData.name,
        description: updatedData.comment
  }).unwrap();
      setEditPhotoTargetId(null);
      setIsUpdateSuccessOpen(true);
    } catch (err) {
      console.error('Fail:', err);
    }
  };

  const handleAttemptCloseEdit = (hasChanges: boolean) => {
    if (hasChanges) {
      setIsDiscardWarningOpen(true);
    } else {
      setEditPhotoTargetId(null);
    }
  };

  const handleConfirmDiscard = () => {
    setIsDiscardWarningOpen(false);
    setEditPhotoTargetId(null);
  };

  const closeDeleteModal = () => {
    setDeleteTargetId(null);
    setIsDeletedSuccess(false);
  };

  if (isLoading) {
    return <div>Loading photos from server...</div>;
  }

  return (
    <section className="px-[30px] bg-bg-main min-h-screen">

      <div className="mb-[40px]">
        <h1 className="text-2xl font-bold leading-[1.5] max-w-[311px] lg:max-w-[965px]">{gallery?.title || 'Gallery ID: ' + galleryId}</h1>
        <p className="text-text-secondary leading-[1.5] max-w-[311px] lg:max-w-[965px]">{gallery?.description || 'No description available'}</p>
      </div>

      <div className="flex flex-wrap gap-3.5">
        {photos.map((photo: any, index: number) => {
          const photoId = photo?.id || index;
          const rawUrl = photo?.url || (typeof photo === 'string' ? photo : '');
          const url = rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`;

          return (
            <div
              key={photoId}
              className="group p-1 bg-bg-main relative"
            >
              <ContextMenu
                itemId={photoId}
                activeMenuId={activeMenuId}
                setActiveMenuId={setActiveMenuId}
                onDeleteClick={() => setDeleteTargetId(photoId)}
                onEditClick={() => {

               setEditPhotoTargetId(photoId);
               }}
              />

              <img
  src={url}
  alt="Gallery item"
  className="w-[120px] h-[120px] rounded-2xl  object-cover block"
  onError={(e) => {
    console.error('Fail:', url);

    e.currentTarget.src = '/public/images/gallery.png';
  }}
/>
              <p className="max-w-[120px] mt-1.5 mb-0 truncate">
                {photo?.title || 'No title'}
              </p>
              <p className="text-[10px] max-w-[120px] text-text-secondary truncate mt-0.5">
                {photo?.description || 'No description'}
              </p>
            </div>
          );
        })}
      </div>

      {photos.length > 0 && (
        <div className="mt-5 flex justify-start">
          <button
            onClick={handleDeleteAllPhotos}
            className="text-accent hover:text-accent-hover cursor-pointer text-l font-medium p-0"
          >
            Delete All ({photos.length} photos)
          </button>
        </div>
      )}

      {photos.length === 0 && (
        <div className="text-[#999] my-5 mx-0">Gallery is empty</div>
      )}

       <EditPhotoModal
        isOpen={editPhotoTargetId !== null && !isDiscardWarningOpen}
        isUpdating={isPhotoUpdating}
        initialName={currentEditingPhoto?.title || ''}
        initialComment={currentEditingPhoto?.description || ''}
        onSave={handleSavePhotoDetails}
        onAttemptClose={handleAttemptCloseEdit}
      />

      <ConfirmationModal
        isOpen={isDiscardWarningOpen}
        title="Are you sure you want to leave?"
        description="You have unsaved changes. If you leave the page now, unsaved changes will be lost."
        confirmText="Confirm"
        cancelText="Cancel"
        type="warning"
        onConfirm={handleConfirmDiscard}
        onClose={() => setIsDiscardWarningOpen(false)}
      />

      <ConfirmationModal
        isOpen={isUpdateSuccessOpen}
        title="Success"
        description="The changes were successfully saved."
        confirmText="Close"
        type="success"
        onConfirm={() => setIsUpdateSuccessOpen(false)}
        onClose={() => setIsUpdateSuccessOpen(false)}
      />

      <DeleteModal
        isOpen={deleteTargetId !== null}
        isDeleting={isPhotoDeleting}
        isDeletedSuccess={isDeletedSuccess}
        title="Delete photos"
        description="Are you sure you want to delete photos from the galerry?"
        onConfirm={handleDeletePhoto}
        onClose={closeDeleteModal}
      />
    </section>
  );
};
