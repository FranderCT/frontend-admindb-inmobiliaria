import axios from "axios";

const altosDelValleAPI = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,

})

export default altosDelValleAPI