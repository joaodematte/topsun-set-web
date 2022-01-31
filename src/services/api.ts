import Axios from "axios";

const api = Axios.create({
  baseURL: "https://topsun-backend.herokuapp.com",
});

console.log(process.env.APP_TYPE);

export default api;
