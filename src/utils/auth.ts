import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const decoded: { exp: number } = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    return true; 
  }
};

export const logout = () => {
  localStorage.removeItem('userToken');
  localStorage.removeItem('customerId');
  localStorage.removeItem('userFullName');
  // Use window.location for a hard refresh to clear any cached states
  window.location.href = '/signin'; 
};