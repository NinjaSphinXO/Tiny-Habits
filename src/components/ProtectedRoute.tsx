import { useAppSelector } from "../hooks/redux";
import { Navigate, Outlet } from "react-router";
const ProtectedRoute = () => {
  const { loading, user } = useAppSelector((state) => state.auth);

  if (loading) return <p role="status">Loading...</p>;
  if (!user) return <Navigate to="/login" replace />;
  return <Outlet />;
};
export default ProtectedRoute;
