import axios from "axios";
export const CLOUDINARY_UPLOAD_URL = import.meta.env.VITE_CLOUDINARY_UPLOAD_URL;
export const CLOUDINARY_UPLOAD_PRESET = import.meta.env
  .VITE_CLOUDINARY_UPLOAD_PRESET;

export const connect = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});
