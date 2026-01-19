import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Product } from "@/types/product";

type InitialState = {
  value: Product;
};

const initialState: InitialState = {
  value: {
    id: 0,
    productId: 0,
    productName: "",
    title: "",
    reviewsCount: 0, // Using reviewsCount to match your API
    price: 0,
    oldPrice: 0,
    discountedPrice: 0,
    thumbnailImageUrl: null,
    slug: "",
    description: "",
    shortDescription: "",
    stockQuantity: 0,
    imgs: { 
      thumbnails: [], 
      previews: [], 
      fullSize: [] // Added this to fix the error
    },
    attributes: []
  } as Product,
};

export const productDetails = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    updateproductDetails: (state, action: PayloadAction<Partial<Product>>) => {
      state.value = { ...state.value, ...action.payload } as Product;
    },
  },
});

export const { updateproductDetails } = productDetails.actions;
export default productDetails.reducer;