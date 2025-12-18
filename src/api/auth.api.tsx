
import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

export const registerUser = (data: any) =>
  API.post("/users/register", data).then((res) => res.data);

export const loginUser = (data: any) =>
  API.post("/users/login", data).then((res) => res.data);
