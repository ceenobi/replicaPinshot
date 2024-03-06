import axios from "axios"
import {toast} from "react-toastify"
import { CLOUDINARY_UPLOAD_PRESET, CLOUDINARY_UPLOAD_URL } from "./connect";


export const uploadToCloudinary = async (files) => {
  const formData = new FormData();
  formData.append("file", files);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
  try {
    const data = await axios.post(CLOUDINARY_UPLOAD_URL, formData);
    return data;
  } catch (error) {
    toast.error("There was an error uploading your image");
    console.error(error);
    throw error;
  }
};