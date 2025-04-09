import axios from "axios";

const API_BASE = "http://127.0.0.1:5000/api";

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

export const getMenu = async () => {
  try {
    const response = await api.get('/menu');
    return response.data;
  } catch (error) {
    console.error("API error fetching menu:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

const ApiService = {
  getMenu
};

export default ApiService;