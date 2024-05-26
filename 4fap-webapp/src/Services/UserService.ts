import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/users";

export const updateStorageUsed = async (userId: number, used: number) => {
  try {
    return await axios.get(`${API_BASE_URL}/${userId}/storage-used/${used}`);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};
