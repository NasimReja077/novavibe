import { useDispatch, useSelector } from "react-redux";
import {
  loginUser,
  registerUser,
  logoutUser,
  fetchMe,
  clearError,
} from "../state/auth.slice.js";

export const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector(
    (state) => state.auth
  );

  return {
    user,
    isAuthenticated,
    loading,
    error,

    login: (credentials) => dispatch(loginUser(credentials)),
    register: (userData) => dispatch(registerUser(userData)),
    logout: () => dispatch(logoutUser()),
    fetchMe: () => dispatch(fetchMe()),
    clearError: () => dispatch(clearError()),
  };
};