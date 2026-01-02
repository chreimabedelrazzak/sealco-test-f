export interface WishListItemVm {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  description?: string;
}

export interface AddToWishListRequest {
  productId: number;
  quantity: number;
}

export interface WishListResponse {
  message: string;
}