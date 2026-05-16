import { createApi } from '@reduxjs/toolkit/query/react';
import { baseQueryWithReauth } from './baseQuery';
import {
  UserInfo,
  Photo,
  Gallery,
  PaginationMeta,
  PaginatedResponse,
  CreateGalleryDto,
  UpdateGalleryDto,
  PaginationParams,
  UploadPhotoArgs,
  UpdatePhotoArgs,
} from './types/galleryInterfaces';

export const galleryApi = createApi({
  reducerPath: 'galleryApi',
  baseQuery: baseQueryWithReauth,
  tagTypes: ['Gallery', 'GalleryList', 'PhotoList'],
  endpoints: (builder) => ({
    createGallery: builder.mutation<Gallery, CreateGalleryDto>({
      query: (body) => ({
        url: '/galleries',
        method: 'POST',
        body,
        formData: true,
      }),
      invalidatesTags: ['GalleryList'],
    }),

    findAllGalleries: builder.query<PaginatedResponse<Gallery>, PaginationParams | void>({
      query: (params) => ({
        url: '/galleries',
        method: 'GET',
        params: {
          page: params?.page ?? 1,
          limit: params?.limit ?? 10,
        },
      }),
      providesTags: ['GalleryList'],
    }),

    findOneGallery: builder.query<Gallery, number>({
      query: (id) => ({
        url: `/galleries/${id}`,
        method: 'GET',
      }),
      providesTags: (result, error, id) => [{ type: 'Gallery', id }],
    }),

    findPhotosByGallery: builder.query<PaginatedResponse<Photo>, { galleryId: number } & PaginationParams>({
      query: ({ galleryId, page = 1, limit = 20 }) => ({
        url: `/galleries/${galleryId}/photos`,
        method: 'GET',
        params: { page, limit },
      }),
      providesTags: (result, error, { galleryId }) => [{ type: 'PhotoList', id: galleryId }],
    }),

    updateGallery: builder.mutation<Gallery, { id: number; body: UpdateGalleryDto }>({
      query: ({ id, body }) => ({
        url: `/galleries/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, { id }) => ['GalleryList', { type: 'Gallery', id }],
    }),

    removeGallery: builder.mutation<void, number>({
      query: (id) => ({
        url: `/galleries/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['GalleryList', 'Gallery'],
    }),

    addPhoto: builder.mutation<Photo, UploadPhotoArgs>({
      query: ({ galleryId, title, description, file }) => {
        const formData = new FormData();
        formData.append('title', title);
        if (description) formData.append('description', description);
        formData.append('file', file);

        return {
          url: `/galleries/${galleryId}/photos`,
          method: 'POST',
          body: formData,
        };
      },
      invalidatesTags: (result, error, { galleryId }) => [{ type: 'PhotoList', id: galleryId }],
    }),

    updatePhoto: builder.mutation<Photo, UpdatePhotoArgs>({
      query: ({ photoId, ...body }) => ({
        url: `/galleries/photos/${photoId}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['PhotoList'],
    }),

    removePhoto: builder.mutation<void, number>({
      query: (photoId) => ({
        url: `/galleries/photos/${photoId}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['PhotoList'],
    }),
  }),
});

export const {
  useCreateGalleryMutation,
  useFindAllGalleriesQuery,
  useFindOneGalleryQuery,
  useFindPhotosByGalleryQuery,
  useUpdateGalleryMutation,
  useRemoveGalleryMutation,
  useAddPhotoMutation,
  useUpdatePhotoMutation,
  useRemovePhotoMutation,
} = galleryApi;
