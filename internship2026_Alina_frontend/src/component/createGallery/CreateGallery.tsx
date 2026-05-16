//import { SmallHeader } from '../common/Headers';
//import { UploadZone } from './UploadZone';
import { useState, ChangeEvent } from 'react';
import { useCreateGalleryMutation } from '../../store/api/galleryApi';
import { PhotoItem } from '../../type/PhotoItem';
import { Camera } from 'lucide-react';


interface ToastState {
  message: string;
  type: 'success' | 'warning' | 'error';
}

export const CreateGallery = () => {
  const [createGallery, { isLoading }] = useCreateGalleryMutation();
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const [galleryTitle, setGalleryTitle] = useState('');
  const [galleryDescription, setGalleryDescription] = useState('');

  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (message: string, type: 'success' | 'warning' | 'error') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;

    if (e.target.files.length > 50) {
      showToast('You cannot upload more than 50 photos at once.', 'warning');
      return;
    }

    const selectedFiles = Array.from(e.target.files);
    const newPhotos: PhotoItem[] = selectedFiles.map(file => ({
      id: crypto.randomUUID(),
      file,
      previewUrl: URL.createObjectURL(file),
      title: '',
      description: '',
    }));

    setPhotos(prev => [...prev, ...newPhotos]);
  };

  const handleInputChange = (id: string, field: 'title' | 'description', value: string) => {
    setPhotos(prev =>
      prev.map(photo => (photo.id === id ? { ...photo, [field]: value } : photo))
    );
  };

  const handleClearGallery = () => {
    photos.forEach(photo => URL.revokeObjectURL(photo.previewUrl));
    setPhotos([]);
    setGalleryTitle('');
    setGalleryDescription('');
  };

 const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();

  console.log('--- СТАРТ САБМІТУ ГАЛЕРЕЇ ---');
  console.log('Загальний стан масиву photos перед збором:', photos);

  if (!galleryTitle.trim()) {
    console.error('Помилка валідації: Назва галереї порожня.');
    return;
  }

  try {
    const formData = new FormData();
    formData.append('title', galleryTitle);
    formData.append('description', galleryDescription);

    console.log('Записано в FormData: title =', galleryTitle, ', description =', galleryDescription);

    photos.forEach((photo, index) => {
      console.log(`Додавання фото [${index}]:`, {
        name: photo.file.name,
        size: photo.file.size,
        title: photo.title,
        description: photo.description
      });

      if (photo.file instanceof File) {
        formData.append('files', photo.file);
      } else {
        console.error(`Критична помилка: Елемент під індексом ${index} не є файлом типу File!`, photo.file);
      }

      formData.append(`titles[${index}]`, photo.title);
      formData.append(`descriptions[${index}]`, photo.description);
    });

    console.log('--- Фінальний вміст FormData (ключ / значення) ---');
    for (let pair of (formData as any).entries()) {
      console.log(pair[0] + ': ', pair[1]);
    }

    console.log('Надсилання запиту через RTK Query мутацію...');
    const result = await createGallery(formData).unwrap();

    console.log('УСПІХ! Відповідь сервера:', result);
    showToast('Gallery created successfully!', 'success');
    handleClearGallery();

  } catch (error: any) {
    console.error('--- ПОМИЛКА ЗАПИТУ ---');
    console.error('Повний об\'єкт помилки:', error);

    if (error?.status) {
      console.error(`HTTP Статус код від сервера: ${error.status}`);
    }
    if (error?.data) {
      console.error('Повідомлення про помилку від бекенда:', error.data);
    }

    showToast('Failed to create gallery', 'error');
  }
  console.log('--- КІНЕЦЬ САБМІТУ ГАЛЕРЕЇ ---');
};

  return (
    <section className="flex flex-col gap-10 relative p-4 lg:p-0">

      {toast && (
        <div className="fixed top-5 right-5 z-50 flex items-center justify-center px-4 rounded shadow-lg transition-all duration-300
          w-[311px] h-[60px] lg:w-[550px]
          text-white text-sm font-medium
          ${toast.type === 'success' ? 'bg-green-600' : ''}
          ${toast.type === 'warning' ? 'bg-yellow-500 text-black' : ''}
          ${toast.type === 'error' ? 'bg-red-600' : ''}
        ">
          {toast.message}
        </div>
      )}

      <div>
        <h2 className="text-xl font-bold">Create New Gallery</h2>
      </div>

      <div className="flex flex-col gap-4 max-w-[550px]">
        <input
          type="text"
          value={galleryTitle}
          onChange={(e) => setGalleryTitle(e.target.value)}
          placeholder="Gallery Title (Required)"
          required
          className="border border-gray-300 rounded px-4 py-2 outline-none focus:border-accent"
        />
        <textarea
          value={galleryDescription}
          onChange={(e) => setGalleryDescription(e.target.value)}
          placeholder="Gallery Description (Optional)"
          rows={3}
          className="border border-gray-300 rounded px-4 py-2 outline-none focus:border-accent resize-none"
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="bg-pink-50 w-[330px] h-[322px] flex flex-col items-center justify-center gap-5 rounded-lg border-2 border-dashed border-gray-300 p-6">
          <div className="text-center">
            <p className="text-[16px] font-bold leading-[150%]">Drag and drop photo here</p>
            <p className="text-[12px] leading-[150%] text-gray-500">JPEG, PNG (max 5MB / picture)</p>
          </div>
          <div className="flex items-center gap-[12px] w-full justify-center">
            <div className="w-[75.5px] h-[1px] bg-black"></div>
            <p className="text-[16px] font-bold leading-[150%]">OR</p>
            <div className="w-[75.5px] h-[1px] bg-black"></div>
          </div>
          <label className="text-[14px] font-medium bg-accent border rounded px-6 py-2 cursor-pointer hover:bg-opacity-90 flex items-center gap-2">
            <Camera className="w-4 h-4" />
            Upload
            <input type="file" accept="image/*" multiple onChange={handleFileChange} className="hidden" />
          </label>
        </div>

        <div className="flex-1 flex flex-col gap-6 max-h-[400px] overflow-y-auto pr-2">
          {photos.map(photo => (
            <div key={photo.id} className="flex gap-5 border border-gray-200 p-4 rounded-lg bg-white shadow-sm">
              <div className="w-[120px] h-[120px] shrink-0 rounded overflow-hidden bg-gray-50">
                <img src={photo.previewUrl} alt="Preview" className="w-full h-full object-cover" />
              </div>
              <div className="flex flex-col gap-3 flex-1">
                <input
                  type="text"
                  value={photo.title}
                  onChange={e => handleInputChange(photo.id, 'title', e.target.value)}
                  placeholder="Photo Title"
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full outline-none focus:border-accent"
                />
                <textarea
                  value={photo.description}
                  onChange={e => handleInputChange(photo.id, 'description', e.target.value)}
                  placeholder="Photo Description"
                  rows={2}
                  className="border border-gray-300 rounded px-3 py-1.5 text-sm w-full outline-none focus:border-accent resize-none"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {photos.length > 0 && (
        <div className="flex gap-4">
          <button
            onClick={handleSubmit}
            disabled={isLoading || !galleryTitle.trim()}
            className="text-[14px] font-medium bg-accent text-white px-6 py-2.5 rounded shadow hover:bg-opacity-90 disabled:opacity-50"
          >
            Create gallery
          </button>
          <button
            onClick={handleClearGallery}
            className="text-[14px] font-medium bg-gray-200 text-gray-700 px-6 py-2.5 rounded hover:bg-gray-300"
          >
            Delete
          </button>
        </div>
      )}
    </section>
  );
};
