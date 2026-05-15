export const galleryApi = createApi({
  reducerPath: 'galleryApi',

  baseQuery: baseQueryWithReauth,

  tagTypes: ['Gallery'],

  endpoints: builder => ({
    getGallery: builder.query<
      GalleryImage[],
      void
    >({
      query: () => '/gallery',

      providesTags: ['Gallery'],
    }),

    uploadImages: builder.mutation<
      void,
      FormData
    >({
      query: formData => ({
        url: '/gallery/upload',

        method: 'POST',

        body: formData,
      }),

      invalidatesTags: ['Gallery'],
    }),

    updateImage: builder.mutation<
      GalleryImage,
      {
        id: string;
        title: string;
        description: string;
      }
    >({
      query: ({ id, ...body }) => ({
        url: `/gallery/${id}`,

        method: 'PATCH',

        body,
      }),

      invalidatesTags: ['Gallery'],
    }),

    deleteImage: builder.mutation<
      void,
      string
    >({
      query: id => ({
        url: `/gallery/${id}`,

        method: 'DELETE',
      }),

      invalidatesTags: ['Gallery'],
    }),
  }),
});
