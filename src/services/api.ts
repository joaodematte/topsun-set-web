import Axios from "axios";

const api = Axios.create({
  baseURL: "https://topsun-backend.herokuapp.com",
});

export default api;
