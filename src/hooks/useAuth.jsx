import AuthContext from "../context/AuthProvider";
import React from "react";
import { useContext } from "react";

const useAuth = () => {
  return useContext(AuthContext);
};

export default useAuth;
