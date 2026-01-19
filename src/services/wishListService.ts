import { apiClient } from "./apiClient";
import { WishListItemVm, AddToWishListRequest, WishListResponse } from "@/types/WishList";

export const wishListService = {
  /**
   * Retrieves all items in the wishlist for a specific user ID.
   */
  getWishlistByUserId: async (userId: number | string, userToken: string): Promise<WishListItemVm[]> => {
    try {
      const response = await apiClient.get<WishListItemVm[]>(`/wishlist/${userId}`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error("Wishlist Fetch Error:", error.response?.data || error.message);
      throw error;
    }
  },

  /**
   * Adds a product to the wishlist for a specific user.
   */
  addItemToWishlist: async (
    userId: number | string, 
    data: AddToWishListRequest, 
    userToken: string
  ): Promise<WishListResponse> => {
    try {
      // Matches the backend route: [HttpPost("add-item/{userId}")]
      const response = await apiClient.post<WishListResponse>(
        `/wishlist/add-item/${userId}`, 
        data, 
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Wishlist Add Error:", error.response?.data || error.message);
      throw error;
    }
  },
  
  removeItemFromWishlist: async (
    userId: number | string,
    productId: number,
    userToken: string
  ): Promise<WishListResponse> => {
    try {
      const response = await apiClient.delete<WishListResponse>(
        `/wishlist/remove-item/${userId}/${productId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error("Wishlist Remove Error:", error.response?.data || error.message);
      throw error;
    }
  }

};