import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useFindAllGalleriesQuery, useRemoveGalleryMutation } from '../store/api/galleryApi';


import { DeleteModal } from './common/DeleteModal';
import { ContextMenu } from './common/ContextMenu';

export const GalleriesList = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const [activeMenuId, setActiveMenuId] = useState<number | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);
  const [isDeletedSuccess, setIsDeletedSuccess] = useState(false);

  const { data, isLoading } = useFindAllGalleriesQuery({ page, limit: itemsPerPage });
  const [removeGallery, { isLoading: isDeleting }] = useRemoveGalleryMutation();

  const galleries = data?.data || [];
  const totalCount = data?.totalCount || 0;
  const totalPages = Math.ceil(totalCount / itemsPerPage);

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
    <section className="flex flex-col gap-10 p-4 lg:p-0 relative">
      <h2 className="text-xl font-bold">Galleries</h2>

      <div className="grid grid-cols-1 justify-items-center sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {galleries.map((gallery: any) => (
          <div
            key={gallery.id}
            className="w-[235px] h-[287px] flex flex-col bg-white rounded shadow-sm border border-gray-100 overflow-hidden relative group"
          >
            <ContextMenu
              itemId={gallery.id}
              activeMenuId={activeMenuId}
              setActiveMenuId={setActiveMenuId}
              onDeleteClick={() => setDeleteTargetId(gallery.id)}
              onEditClick={() => navigate(`/galleries/${gallery.id}/edit`)}
            />

            <Link to={`/galleries/${gallery.id}`} className="flex flex-col w-full h-full">
              <div className="w-[235px] h-[235px] grid grid-cols-3 grid-rows-3 gap-[2px] bg-gray-100 shrink-0">
                {Array.from({ length: 9 }).map((_, index) => {
                  const photoObj = gallery.photos?.[index] || gallery.images?.[index];
                  const rawUrl = photoObj?.url || (typeof photoObj === 'string' ? photoObj : null);
                  const imgUrl = rawUrl
                    ? (rawUrl.startsWith('http') ? rawUrl : `http://localhost:3000${rawUrl}`)
                    : null;

                  return (
                    <div key={index} className="w-full h-full bg-gray-200 overflow-hidden">
                      {imgUrl ? (
                        <img src={imgUrl} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full bg-gray-50" />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="p-2 flex flex-col flex-1 justify-center overflow-hidden">
  <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1 min-w-0">
    <span className="truncate">{gallery.title}</span>
    <span className="text-gray-400 font-normal shrink-0">
      ({gallery.photos?.length || gallery.images?.length || 0} photos)
    </span>
  </h3>

  {gallery.description && (
    <p className="text-xs text-gray-500 truncate mt-0.5">{gallery.description}</p>
  )}
</div>
            </Link>
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            disabled={page === 1}
            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
            className="px-4 py-2 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-gray-700">
            Page {page} of {totalPages}
          </span>
          <button
            disabled={page === totalPages}
            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
            className="px-4 py-2 border rounded text-sm disabled:opacity-40 hover:bg-gray-50"
          >
            Next
          </button>
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
