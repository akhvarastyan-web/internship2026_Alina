import { MoreVertical } from 'lucide-react';

interface ContextMenuProps {
  itemId: number;
  activeMenuId: number | null;
  setActiveMenuId: (id: number | null) => void;
  onEditClick(e);
  onDeleteClick: () => void;
  to?: string;
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
    <div className="absolute top-0 right-0 z-10">
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setActiveMenuId(isOpen ? null : itemId);
        }}
        className="w-6 h-6 flex items-center justify-center bg-gray-200 bg-opacity-80 hover:bg-gray-300 text-gray-700 rounded-full transition-colors"
      >
        <MoreVertical size={16} />
      </button>

      {isOpen && (
  <div
    className="absolute right-0 mt-1 w-[132px] h-[92px] bg-bg-main rounded shadow-lg flex flex-col z-20 overflow-hidden"
    onClick={(e) => e.stopPropagation()}
  >
    <button
      onClick={(e) => {
    e.stopPropagation();
    e.nativeEvent.stopImmediatePropagation();
    onEditClick(e);
    setActiveMenuId(null);
  }}
      className="flex-1 text-left px-4 hover:bg-accent-soft border-b flex items-center"
    >
      Edit
    </button>

    <button
      onClick={() => {
        setActiveMenuId(null);
        onDeleteClick();
      }}
      className="flex-1 text-left px-4 hover:bg-accent-soft flex items-center"
    >
      Delete
    </button>
  </div>
)}
    </div>
  );
};
