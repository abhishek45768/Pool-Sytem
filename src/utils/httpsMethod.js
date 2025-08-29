import axios from "axios";

const API = axios.create({
  baseURL: "https://pool-sytem-backend.onrender.com/api/", 
  headers: {
    "Content-Type": "application/json",
  },
});

// Generic API request function
export const apiRequest = async (method, endpoint, body = {}, params = {}) => {
  try {
    const response = await API.request({
      method,
      url: endpoint,
      data: body,
      params,
    });
    return response.data;
  } catch (error) {
    console.error("API Error:", error.response?.data || error.message);
    throw error.response?.data || error;
  }
};
