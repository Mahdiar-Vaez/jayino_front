// src/auth/ProtectedRoute.tsx
import { Navigate, Outlet } from "react-router-dom";
import type { Role, User } from "../context/AuthContext";

type Props = {
  allowedRoles?: Role[];
};

const ProtectedRoute = ({ allowedRoles }: Props) => {
  let user:any=localStorage.getItem("user")
   const parsedUser:User=JSON.parse(user)
  const token=localStorage.getItem("token")
  
  if (!token || !user) {
    return <Navigate to="/" replace />;
  }

  // رول مجاز نیست
  if (allowedRoles && !allowedRoles.includes(parsedUser.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
