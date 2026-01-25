export interface WishListItemVm {
  thumbnailImageUrl: string;
  price: number;
  oldPrice: number;
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  quantity: number;
  description?: string;
  shortDescription?: string;
}

export interface AddToWishListRequest {
  productId: number;
  quantity: number;
}

export interface WishListResponse {
  message: string;
}