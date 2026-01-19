import { apiClient } from "./apiClient";
import {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  AccountAddressesRequestResponse,
  SaveAddressResponse,
  SelectOption,
  District,
} from "../types/auth";

/**
 * Sends login credentials to the SimplCommerce API
 */
export const login = async (
  credentials: LoginRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/account/login",
      credentials
    );

    if (response.data.success && response.data.token) {
      // 1. Save the token
      localStorage.setItem("userToken", response.data.token);

      // 2. Save the FullName (matching the key from your API JSON)
      if (response.data.fullName) {
        localStorage.setItem("userFullName", response.data.fullName);
      }

      if (response.data.id) {
        localStorage.setItem("customerId", response.data.id.toString());
      }
    }

    return response.data;
  } catch (error: any) {
    console.error("Login API Error:", error.response?.data || error.message);
    throw error;
  }
};

export const logout = (): void => {
  localStorage.clear();
};

/**
 * Sends registration data to the SimplCommerce API
 */
export const register = async (
  data: RegisterRequest
): Promise<LoginResponse> => {
  try {
    const response = await apiClient.post<LoginResponse>(
      "/account/register",
      data
    );

    // If your API automatically logs the user in after registration:
    if (response.data.success && response.data.token) {
      localStorage.setItem("userToken", response.data.token);

      if (response.data.fullName) {
        localStorage.setItem("userFullName", response.data.fullName);
      }
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Registration API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

// @/services/authService.ts
export const isAuthenticated = () => {
  // Check if token exists in cookies or localStorage
  if (typeof window !== "undefined") {
    return !!localStorage.getItem("userToken");
  }
  return false;
};

export const changeFullName = async (
  fullName: string,
  token: string
): Promise<{ success: boolean; message: string; fullName: string }> => {
  try {
    const response = await apiClient.post(
      "/account/change-fullname",
      { fullName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.success) {
      // Keep localStorage in sync so the header/sidebar updates
      localStorage.setItem("userFullName", response.data.fullName);
    }

    return response.data;
  } catch (error: any) {
    console.error(
      "Change FullName API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

export const getAddresses =
  async (): Promise<AccountAddressesRequestResponse> => {
    try {
      const token = localStorage.getItem("userToken");
      const response = await apiClient.get<AccountAddressesRequestResponse>(
        "/account/addresses",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error: any) {
      console.error(
        "Get Addresses API Error:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

/**
 * Saves or Updates the user's addresses
 */
export const saveAddresses = async (
  data: AccountAddressesRequestResponse
): Promise<SaveAddressResponse> => {
  try {
    const token = localStorage.getItem("userToken");
    const response = await apiClient.post<SaveAddressResponse>(
      "/account/addresses",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Save Addresses API Error:",
      error.response?.data || error.message
    );
    throw error;
  }
};

/**
 * Fetches all states/provinces for a specific country (e.g., Lebanon = 118)
 * Hits: GET /api/account/countries/{countryId}/states-provinces
 */
export const getStatesOrProvinces = async (
  countryId: string = "118"
): Promise<SelectOption[]> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem('userToken') : null;
    const response = await apiClient.get<SelectOption[]>(
      `/account/countries/${countryId}/states-provinces`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Get States API Error:",
      error.response?.data || error.message
    );
    return [];
  }
};

/**
 * Fetches districts for a specific state/province
 * Hits: GET /api/account/states-provinces/{stateId}/districts
 */
export const getDistricts = async (stateId: number): Promise<District[]> => {
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem('userToken') : null;
    const response = await apiClient.get<District[]>(
      `/account/states-provinces/${stateId}/districts`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    console.error(
      "Get Districts API Error:",
      error.response?.data || error.message
    );
    return [];
  }
};