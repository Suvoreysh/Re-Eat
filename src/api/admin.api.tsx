import axios from "axios";

const API = axios.create({
    baseURL: "https://re-eat-backend.onrender.com/api",
//   baseURL: "https://re-eat-backend.onrender.com/api",
});

export const adminLogin = async (data: {
  username: string;
  password: string;
}) => {
  const res = await API.post("/admin/login", data);
  return res.data;
};
