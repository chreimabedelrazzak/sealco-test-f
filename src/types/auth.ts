export interface LoginRequest {
  email: string;
  password?: string; // Optional if you handle state carefully
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  token: string;
  error?: string; // Good to include for error handling
  fullName?: string;
  id?: number;
}

export interface RegisterRequest {
  email: string;
  fullName: string;
  password: string;
  confirmPassword: string;
  callbackUrl?: string; // Optional since it might not always be needed
}

// Reuse LoginResponse if the API returns the same structure (success, token, etc.)

export interface AddressVm {
  userAddressId: number | null;
  contactName: string;
  phone: string;
  addressLine1: string;
  addressLine2: string;
  districtId: number | null;
  districtName?: string;
  zipCode: string;
  stateOrProvinceId: number;
  stateOrProvinceName?: string;
  city: string;
  countryId: string;
  countryName?: string;
}

export interface AccountAddressesRequestResponse {
  newShippingAddress: AddressVm | null;
  newBillingAddress: AddressVm | null;
  existingShippingAddressId: number | null;
}

export interface SaveAddressResponse {
  success: boolean;
  message: string;
  shippingAddressId: number;
  billingAddressId: number;
}

// For States/Provinces (matching your Value/Text example)
export interface SelectOption {
  value: string;
  text: string;
  disabled: boolean;
  group: any | null;
  selected: boolean;
}

// For Districts (matching your Id/Name example)
export interface District {
  id: number;
  name: string;
}