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
    title: "", // Map to productName in your components
    reviewsCount: 0, // Matches your .NET API property
    price: 0,
    oldPrice: 0,
    discountedPrice: 0,
    thumbnailImageUrl: "",
    slug: "",
    description: "",
    shortDescription: "", // Added missing property
    stockQuantity: 0,     // Added missing property
    categories: [],       // Added missing property
    attributes: [],       // Added missing property
    imgs: { 
      thumbnails: [], 
      previews: [], 
      fullSize: []        // Fixed: Added missing fullSize array
    },
  } as Product,
};

export const quickView = createSlice({
  name: "quickView",
  initialState,
  reducers: {
    updateQuickView: (state, action: PayloadAction<Product>) => {
      state.value = action.payload;
    },

    resetQuickView: (state) => {
      state.value = initialState.value;
    },
  },
});

export const { updateQuickView, resetQuickView } = quickView.actions;
export default quickView.reducer;