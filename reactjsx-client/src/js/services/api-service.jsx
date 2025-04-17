// api-service.jsx is a helper module responsible for abstracting and organizing all
// interactions with a backend API (such as a Flask or RESTful service).

import axios from "axios";

// Defines constant string called API_BASE that stores the base URL of the
// backend API (i.e., the Flask webapp server that is running locally)
const API_BASE = "http://127.0.0.1:5000/api";

// Create an Axios instance for making HTTP requests (like GET, POST, etc.)
// with a consistent URL, headers, timeout, etc.
const api = axios.create({
  baseURL: API_BASE,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Export getMenu as a constant that is asynchronous to decrease page load time
export const getMenu = async () => {
  try {
    const response = await api.get('/menu'); // Pause execution until the API responds
    return response.data;
  } catch (error) {
    console.error("API error fetching menu:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Export submitReservation to send reservation form data to Flask
export const submitReservation = async (formData) => {
  try {
    const response = await api.post('/reservations', formData); // POST to Flask route
    return response.data;
  } catch (error) {
    console.error("API error submitting reservation:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Export submitNewsletter to send email to Flask
export const submitNewsletter = async (email) => {
  try {
    const response = await api.post('/newsletter-signup', { email }); // Use the Axios library to make a POST request, with the request body in JSON equivalent to 'email: example@email.com'.
    return response.data;
  } catch (error) {
    console.error("API error submitting newsletter signup:", error.message);
    throw new Error(error.response?.data?.message || error.message);
  }
};

// Make the function callable as a method from ApiService class.
const ApiService = {
  getMenu,
  submitReservation,
  submitNewsletter  // Add the new function to ApiService
};

// Export the class itself
export default ApiService;
