import { rootClient } from "./apiClient";
import { OrderDetailVm } from "@/types/order";

export const orderService = {
  /**
   * Retrieves full order details by ID.
   * Backend will verify ownership via the JWT token.
   */
  getOrderDetails: async (
    orderId: string | number,
    userToken: string
  ): Promise<OrderDetailVm> => {
    try {
      const response = await rootClient.get<OrderDetailVm>(
        `/api/customer/orders/order-confirmation/${orderId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Order Fetch Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },

  getOrderHistory: async (
    userId: string | number,
    userToken: string
  ): Promise<OrderDetailVm[]> => {
    try {
      // Hits the route: api/customer/orders/users/{userId}
      const response = await rootClient.get<OrderDetailVm[]>(
        `/api/customer/orders/users/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Order History Fetch Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  },
};
