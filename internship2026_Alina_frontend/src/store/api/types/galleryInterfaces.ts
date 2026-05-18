export interface UserInfo {
  id: number;
  email: string;
}

export interface Photo {
  id: number;
  title: string;
  description?: string;
  url: string;
  createdAt: string;
}

export interface Gallery {
  id: number;
  title: string;
  description?: string;
  createdAt: string;
  user: UserInfo;
  photos?: Photo[];
}

export interface PaginationMeta {
  totalItems: number;
  itemCount: number;
  itemsPerPage: number;
  totalPages: number;
  currentPage: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
}

export interface CreateGalleryDto {
  title: string;
  description?: string;
}

export interface UpdateGalleryDto {
  title?: string;
  description?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

export interface UploadPhotoArgs {
  galleryId: number;
  title: string;
  description?: string;
  file: File;
}

export interface UpdatePhotoArgs {
  photoId: number;
  title?: string;
  description?: string;
}
