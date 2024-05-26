import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

type LoginRequest = {
  username: string;
  password: string;
};

type RegisterRequest = {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string[];
};

type VerifyRequest = {
  email: string;
  code: string;
};

export const login = async (data: LoginRequest) => {
  try {
    return await axios.post(`${API_BASE_URL}/auth/login`, data);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};

export const register = async (data: RegisterRequest) => {
  try {
    return await axios.post(`${API_BASE_URL}/auth/signup`, data);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};

export const verify = async (data: VerifyRequest) => {
  try {
    return await axios.post(`${API_BASE_URL}/auth/verify`, data);
  } catch (error) {
    console.error("Error fetching data:", error);

    throw error;
  }
};
