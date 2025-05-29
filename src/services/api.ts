import axios from "axios";

const API_URL = "https://api.producthunt.com/v2/api/graphql";

export const api = axios.create({
  baseURL: API_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_PRODUCT_HUNT_TOKEN}`,
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
