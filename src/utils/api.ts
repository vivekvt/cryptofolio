import axios from "axios";

export const apiClient = axios.create({
  baseURL: "https://api.coingecko.com/api/v3/",
  timeout: 30000,
});
