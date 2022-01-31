import Axios from "axios";

const api = Axios.create({
  baseURL: "https://siet-backend.herokuapp.com",
});

export default api;
