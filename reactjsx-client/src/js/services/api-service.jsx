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


// Expost getMenu as a constant that is async to decrease page load time
export const getMenu = async () => {
  // Try to get the response from the menu api using the axios api, otherwise catch errors. 
  try {
    const response = await api.get('/menu');
    return response.data;
  } catch (error) {
    console.error("API error fetching menu:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Make the function callable as a method from ApiService class.
const ApiService = {
  getMenu
};

// Export the class itself
export default ApiService;