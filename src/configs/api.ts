import axios from "axios";

export const apiWeather = axios.create({
  baseURL: "http://127.0.0.1:5000",
});
