import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setHeader } from '../store/slices/dashboard/dashboardHeader.slice';
import { useFindAllGalleriesQuery, useRemoveGalleryMutation } from '../store/api/galleryApi';


import { DeleteModal } from './common/DeleteModal';
import { ContextMenu } from './common/ContextMenu';

export const GalleriesList = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  const { data, isLoading } = useFindAllGalleriesQuery({ page, limit: itemsPerPage });
  const [removeGallery, { isLoading: isDeleting }] = useRemoveGalleryMutation();

  const galleries = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const limit = 8;
  const totalPages = data?.meta?.totalPages || data?.totalPages || Math.ceil((data?.total || galleries?.length || 0) / limit);

  useEffect(() => {
    const headerData = {
      title: 'Create Gallery',
      button: {
        text: 'Create new gallery',
        link: `/create-gallery`,
      },
    };

    dispatch(setHeader(headerData));
  }, [dispatch]);

  useEffect(() => {
    const handleGlobalClick = () => setActiveMenuId(null);
    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, []);

  const handleDeleteConfirm = async () => {
    if (!deleteTargetId) return;
    try {
      await removeGallery(deleteTargetId).unwrap();
      setIsDeletedSuccess(true);
    } catch (err) {
      console.error('Fail:', err);
    }
  };

  const closeModal = () => {
    setDeleteTargetId(null);
    setIsDeletedSuccess(false);
  };

  if (isLoading) return <div>Loading galleries...</div>;


  return (
    <section className="relative flex flex-col gap-10 p-4 lg:p-0 relative">
      <h2 className="text-xl font-bold">Galleries</h2>

      <div className="grid grid-cols-1 justify-items-center  sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleries.map((gallery: any) => (
          <div
            key={gallery.id}
            className="w-[235px] h-[287px] flex flex-col bg-accent-soft rounded overflow-hidden relative group"
          >
            <ContextMenu
              itemId={gallery.id}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onDeleteClick={() => setDeleteTargetId(gallery.id)}
              onEditClick={() => navigate(`/update-gallery/${gallery.id}`)}
            />

            <Link to={`/galleries/${gallery.id}`} className="flex flex-col w-full h-full">
  {(() => {
    const totalPhotos = gallery.photos?.length || 0;

    return (
      <>
        <div className="w-[235px] h-[235px] grid grid-cols-3 grid-rows-3 gap-[2px] shrink-0">
          {Array.from({ length: 9 }).map((_, index) => {
            const photoObj = gallery.photos?.[index];
            const rawUrl = photoObj?.url || (typeof photoObj === 'string' ? photoObj : null);
            const imgUrl = rawUrl
              ? (rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`)
              : null;

            const isLastSquare = index === 8;
            const hasMorePhotos = totalPhotos > 9;

            return (
              <div key={index} className="w-full h-full overflow-hidden relative">
                {imgUrl ? (
                isLastSquare && hasMorePhotos ? (
               <div className="w-full h-full flex items-center justify-center text-black text-xs font-bold">
                +more
               </div>
            ) : (
    <img src={imgUrl} alt="" className="w-full h-full  object-cover" />
  )
) : (
  <div className="w-full h-full" />
)}
              </div>
            );
          })}
        </div>

        <div className="p-2 bg-bg-main flex flex-col flex-1 justify-center overflow-hidden">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1 min-w-0">
            <span className="truncate">{gallery.title}</span>
            <span className="text-text-secondary shrink-0">
              ({totalPhotos} photos)
            </span>
          </h3>

          {gallery.description && (
            <p className="text-xs text-gray-500 truncate mt-0.5">{gallery.description}</p>
          )}
        </div>
      </>
    );
  })()}
</Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
  <div className="fixed bottom-0 right-0 bg-bg-main z-[100] flex justify-center items-center gap-2 mt-4 p-4">
  {Array.from({ length: totalPages }, (_, index) => {
    const pageNumber = index + 1;
    return (
      <button
        key={pageNumber}
        onClick={() => setPage(pageNumber)}
        className={`px-3 py-1 border rounded text-sm transition-colors ${
          page === pageNumber
            ? 'bg-accent text-white border-accent font-bold'
            : 'bg-white text-gray-700 hover:bg-gray-50'
        }`}
      >
        {pageNumber}
      </button>
    );
  })}
</div>
)}

      <DeleteModal
        isOpen={deleteTargetId !== null}
        isDeleting={isDeleting}
        isDeletedSuccess={isDeletedSuccess}
        title="Delete Gallery?"
        description="Are you sure you want to delete this gallery? This action cannot be undone."
        onConfirm={handleDeleteConfirm}
        onClose={closeModal}
      />
    </section>
  );
};
