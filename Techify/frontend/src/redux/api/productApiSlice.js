// 🔗 API ENDPOINTS: Product data and review management
import { PRODUCT_URL, UPLOAD_URL } from "../constants";
import { apiSlice } from "./apiSlice";

export const productApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // 📦 GET PRODUCTS: Fetch product list with search
    getProducts: builder.query({
      query: ({ keyword }) => ({
        url: `${PRODUCT_URL}`,
        params: { keyword },
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    // 🆔 GET PRODUCT: Fetch single product details
    getProductById: builder.query({
      query: (productId) => `${PRODUCT_URL}/${productId}`,
      providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
    }),

    // 📋 ALL PRODUCTS: Get complete product catalog
    allProducts: builder.query({
      query: () => `${PRODUCT_URL}/allproducts`,
      providesTags: ["Product"],
    }),

    // 📄 PRODUCT DETAILS: Get full product info with reviews
    getProductDetails: builder.query({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
      }),
      keepUnusedDataFor: 5,
      providesTags: (result, error, productId) => [{ type: "Product", id: productId }],
    }),

    // ➕ CREATE PRODUCT: Add new product (admin only)
    createProduct: builder.mutation({
      query: (productData) => ({
        url: `${PRODUCT_URL}`,
        method: "POST",
        body: productData,
      }),
      invalidatesTags: ["Product"],
    }),

    // ✏️ UPDATE PRODUCT: Edit existing product (admin only)
    updateProduct: builder.mutation({
      query: ({ productId, formData }) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }, "Product"],
    }),

    // 📸 UPLOAD IMAGE: Save product photos
    uploadProductImage: builder.mutation({
      query: (data) => ({
        url: `${UPLOAD_URL}`,
        method: "POST",
        body: data,
      }),
    }),

    // 🗑️ DELETE PRODUCT: Remove product (admin only)
    deleteProduct: builder.mutation({
      query: (productId) => ({
        url: `${PRODUCT_URL}/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // 💬 CREATE REVIEW: Add customer feedback
    createReview: builder.mutation({
      query: (data) => ({
        url: `${PRODUCT_URL}/${data.productId}/reviews`,
        method: "POST",
        body: data,
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),

    // ✏️ UPDATE REVIEW: Edit existing customer feedback
    updateReview: builder.mutation({
      query: ({ productId, reviewId, rating, comment }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews/${reviewId}`,
        method: "PUT",
        body: { rating, comment },
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),

    // 🗑️ DELETE REVIEW: Remove customer feedback
    deleteReview: builder.mutation({
      query: ({ productId, reviewId }) => ({
        url: `${PRODUCT_URL}/${productId}/reviews/${reviewId}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, { productId }) => [{ type: "Product", id: productId }],
    }),

    // 🏆 TOP PRODUCTS: Get highest-rated products
    getTopProducts: builder.query({
      query: () => `${PRODUCT_URL}/top`,
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getNewProducts: builder.query({
      query: () => `${PRODUCT_URL}/new`,
      keepUnusedDataFor: 5,
      providesTags: ["Product"],
    }),

    getFilteredProducts: builder.query({
      query: ({ checked, radio }) => ({
        url: `${PRODUCT_URL}/filtered-products`,
        method: "POST",
        body: { checked, radio },
      }),
      providesTags: ["Product"],
    }),
  }),
});

export const {
  useGetProductByIdQuery,
  useGetProductsQuery,
  useGetProductDetailsQuery,
  useAllProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useCreateReviewMutation,
  useUpdateReviewMutation, 
  useDeleteReviewMutation, 
  useGetTopProductsQuery,
  useGetNewProductsQuery,
  useUploadProductImageMutation,
  useGetFilteredProductsQuery,
} = productApiSlice;