import Axios from "axios";
import { sha256 } from 'js-sha256';

export function login(username,password){
    return Axios.post("http://localhost:8000/api/auth/", {username:username,password:sha256(password)})
    .then((response) => {
      if (response.data.username) {
        localStorage.setItem("user", JSON.stringify(response.data));
      }
      return response.data;
    });
}

export function logout(){
    localStorage.removeItem("user");
}

export function getCurrentUser(){
    return JSON.parse(localStorage.getItem("user"));
}