import axios from "axios";
import { FileContentData } from "@/Types/FileManagerType";

const API_BASE_URL = "http://localhost:8081";

export const uploadFile = async (file: File | null) => {
  try {
    const formdata = new FormData();
    formdata.append("file", file!, file?.name);

    return await axios.post(`${API_BASE_URL}/api/images`, formdata, {
      headers: {
        "Content-Type": "multipart/form-data",
        Accept: "*/*",
      },
    });
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};

export const saveFile = async (data: FileContentData) => {
  try {
    return await axios.post(`${API_BASE_URL}/file`, data);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};

export const getFiles = async (id: number) => {
  try {
    return await axios.get(`${API_BASE_URL}/file/${id}`);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};
