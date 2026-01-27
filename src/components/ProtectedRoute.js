import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ element }) => {
  const isAuthenticated = useSelector((state) => state.auth.token);

  return isAuthenticated ? element : <Navigate to="/sign-in" />;
};

export default ProtectedRoute;
