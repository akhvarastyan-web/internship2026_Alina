import { MoreVertical } from 'lucide-react';
import { MouseEvent } from 'react';

interface ContextMenuProps {
  itemId: number;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  onEditClick: (e: MouseEvent) => void;
  onDeleteClick: () => void;
}

export const ContextMenu = ({
  itemId,
  activeMenuId,
  setActiveMenuId,
  onEditClick,
  onDeleteClick,
}: ContextMenuProps) => {
  const isOpen = activeMenuId === itemId;

  return (
    <div className="absolute top-2 right-2 z-10">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveMenuId(isOpen ? null : itemId);
        }}
        className="w-7 h-7 flex items-center justify-center bg-gray-200 bg-opacity-80 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
        <div
          className="absolute right-0 mt-1 w-[132px] h-[92px] bg-white border border-gray-200 rounded shadow-lg flex flex-col z-20 overflow-hidden"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              setActiveMenuId(null);
              onEditClick(e);
            }}
            className="flex-1 text-left px-4 text-sm font-medium text-gray-700 hover:bg-gray-50 border-b border-gray-100 flex items-center"
          >
            Edit
          </button>

          <button
            onClick={() => {
              setActiveMenuId(null);
              onDeleteClick();
            }}
            className="flex-1 text-left px-4 text-sm font-medium text-red-600 hover:bg-red-50 text-left flex items-center"
          >
            Delete
          </button>
        </div>
      )}
    </div>
  );
};
