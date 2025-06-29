import { useAuth } from "@/provider/auth-context";
import { Navigate, Outlet } from "react-router";

const AuthLayout = () => {
  const {isAuthenticated, isLoading} = useAuth();
  if (isLoading) {
    return <div>Loading...</div>;
  }
  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
};
