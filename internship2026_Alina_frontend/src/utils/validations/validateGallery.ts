import { PhotoItem } from '../../type/PhotoItem';

export interface GalleryErrors {
  title?: string;
  description?: string;
  photos?: Record<number | string, { title?: string; description?: string }>;
}

export interface PhotoErrors {
  title?: string;
  description?: string;
}

export function validateGallery(
  title: string,
  description: string,
  photos?: PhotoItem[],
): GalleryErrors {
  const errors: GalleryErrors = {};
  const titleRegex = /^[a-zA-Zа-яА-ЯіІїЇєЄґҐ0-9\s-]{2,50}$/;
  const trimmedTitle = title.trim();

  if (!trimmedTitle) {
    errors.title = 'Title is required.';
  } else if (trimmedTitle.length < 2 || trimmedTitle.length > 50) {
    errors.title = 'Title must be between 2 and 50 characters.';
  } else if (!titleRegex.test(trimmedTitle)) {
    errors.title = 'Title contains invalid characters.';
  }

  if (description.length > 255) {
    errors.description = 'Description cannot exceed 255 characters.';
  }

  if (photos?.length) {
    const photoErrors: Record<number, PhotoErrors> = {};

    photos.forEach(photo => {
      const photoErr: PhotoErrors = {};
      const trimmed = photo.title.trim();

      if (!trimmed) {
        photoErr.title = 'Title is required.';
      } else if (trimmed.length < 2 || trimmed.length > 50) {
        photoErr.title = 'Title must be between 2 and 50 characters.';
      } else if (!titleRegex.test(trimmed)) {
        photoErr.title = 'Title contains invalid characters.';
      }

      if (photo.description.length > 255) {
        photoErr.description = 'Description cannot exceed 255 characters.';
      }

      if (Object.keys(photoErr).length > 0) {
        photoErrors[photo.id] = photoErr;
      }
    });

    if (Object.keys(photoErrors).length > 0) {
      errors.photos = photoErrors;
    }
  }

  return errors;
}
