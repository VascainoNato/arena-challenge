import axios from "axios";

// We define the base URL of the Product Hunt GraphQL API.
const API_URL = "https://api.producthunt.com/v2/api/graphql";

// We create and export a custom Axios instance named 'api', this instante includes the base URL and default headers.
export const api = axios.create({
  baseURL: API_URL,
  headers: {
    // We inject our personal access token (read from environment variable) into the Authorization header.
    Authorization: `Bearer ${import.meta.env.VITE_PRODUCT_HUNT_TOKEN}`,
    // We specify that we are sending data in JSON format.
    "Content-Type": "application/json",
  },
});
