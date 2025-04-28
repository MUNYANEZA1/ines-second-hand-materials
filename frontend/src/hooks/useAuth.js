// src/hooks/useAuth.js
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  return useContext(AuthContext);
};

// Adding a default export that matches the import in Conversation.jsx
export default useAuth;
