import axios from "axios";

const altosDelValleAPI = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
    // header de autorizacion si es necesario
    headers: {
        'Content-Type': 'application/json',
    },
})

altosDelValleAPI.interceptors.request.use(
  (config: any) => {
    config.headers = config.headers ?? {};

    const hasAuthHeader =
      !!config.headers["Authorization"] || !!config.headers["authorization"];

    if (hasAuthHeader) {
      return config; 
    }

    const sessionToken = localStorage.getItem("token");
    if (sessionToken && sessionToken !== "null" && sessionToken !== "undefined") {
      config.headers["Authorization"] = `Bearer ${sessionToken}`;
    } else {
      delete config.headers["Authorization"];
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default altosDelValleAPI