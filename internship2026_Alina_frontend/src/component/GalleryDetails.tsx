import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
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
    dispatch(
      setHeader({
        title: 'Gallery',
        button: {
          text: 'Go to upload photos',
          link: '/search-results',
        },
      }),
    );
  }, [dispatch]);

  useEffect(() => {
    const handleGlobalClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  if (galleryError || photosError) {
    console.error('Error:', { galleryError, photosError });
  }

  const photos = photosData?.data || (Array.isArray(photosData) ? photosData : null) || (gallery as any)?.photos || [];
  const totalCount = photosData?.totalCount || photos.length || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);
  const currentEditingPhoto = photos.find((p: any) => p?.id === editPhotoTargetId);


  const handleDeletePhotoConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await removePhoto(deleteTargetId).unwrap();
      setIsDeletedSuccess(true);
    } catch (err) {
      console.error('Fail:', err);
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
    return <div style={{ padding: '20px', textTransform: 'uppercase' }}>Loading photos from server...</div>;
  }

  return (
    <section style={{ padding: '20px', background: '#fafafa', minHeight: '100vh' }}>

      <div style={{ marginBottom: '20px', paddingBottom: '10px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>{gallery?.title || 'Gallery ID: ' + galleryId}</h1>
        <p style={{ color: '#666' }}>{gallery?.description || 'No description available'}</p>
      </div>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
        {photos.map((photo: any, index: number) => {
          const photoId = photo?.id || index;
          const rawUrl = photo?.url || (typeof photo === 'string' ? photo : '');
          const url = rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`;

          return (
            <div
              key={photoId}
              className="group"
              style={{ border: '1px solid #ddd', padding: '5px', background: '#fff', position: 'relative' }}
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
                alt=""
                style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block' }}
                onError={(e) => {
                  console.error('Fail:', url);
                  (e.target as any).style.display = 'block';
                }}
              />
              <p style={{ fontSize: '12px', maxWidth: '120px', margin: '5px 0 0' }} className="truncate">
                {photo?.title || 'No title'}
              </p>
            </div>
          );
        })}
      </div>

      {photos.length === 0 && (
        <div style={{ color: '#999', margin: '20px 0' }}>Gallery is empty</div>
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
        onConfirm={handleDeletePhotoConfirm}
        onClose={closeDeleteModal}
      />
    </section>
  );
};
