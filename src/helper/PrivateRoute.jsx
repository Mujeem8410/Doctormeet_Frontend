// src/helper/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // ✅ FIXED

const PrivateRoute = ({ children, role }) => {
  const token = localStorage.getItem("token");

  if (!token) return <Navigate to="/login" />;

  try {
    const decoded = jwtDecode(token); // ✅ FIXED
    if (decoded.role !== role) return <Navigate to="/login" />;
    return children;
  } catch {
    return <Navigate to="/login" />;
  }
};

export default PrivateRoute;
