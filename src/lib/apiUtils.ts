// lib/apiUtils.ts
import api from "./api";

// GET request helper
export const get = async <T = any>(url: string, params?: any) => {
  const response = await api.get<T>(url, { params });
  return response.data;
};

// POST request helper
export const post = async <T = any>(url: string, data?: any) => {
  const response = await api.post<T>(url, data);
  return response.data;
};

// PUT request helper
export const put = async <T = any>(url: string, data?: any) => {
  const response = await api.put<T>(url, data);
  return response.data;
};

// PATCH request helper
export const patch = async <T = any>(url: string, data?: any) => {
  const response = await api.patch<T>(url, data);
  return response.data;
};

// DELETE request helper
export const del = async <T = any>(url: string) => {
  const response = await api.delete<T>(url);
  return response.data;
};
