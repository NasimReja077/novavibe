import { useEffect } from "react";
import { Navigate } from "react-router";
import { useAuth } from "../hook/useAuth.js";

const Protected = ({ children }) => {
  const { user, isAuthenticated, loading, fetchMe } = useAuth();

  useEffect(() => {
    if (!user) {
      fetchMe();
    }
  }, []);

  if (loading && !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#05080f] text-[#5a7ab0] text-sm">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default Protected;
