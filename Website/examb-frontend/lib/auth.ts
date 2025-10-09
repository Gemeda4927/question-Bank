import {jwtDecode} from 'jwt-decode';

export interface DecodedToken {
  id: string;
  role: 'student' | 'instructor' | 'admin';
  exp: number;
}

export const getDecodedToken = (): DecodedToken | null => {
  if (typeof window === 'undefined') return null;
  const token = localStorage.getItem('token');
  if (!token) return null;

  try {
    return jwtDecode<DecodedToken>(token);
  } catch {
    localStorage.removeItem('token');
    return null;
  }
};

export const getUserRole = (): DecodedToken['role'] | null => {
  const decoded = getDecodedToken();
  return decoded ? decoded.role : null;
};
