import axios from "axios";

const APIInstance = axios.create({
  baseURL: "http://localhost:3000/api/",
});

export default APIInstance;
