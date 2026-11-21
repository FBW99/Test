import { Navigate, Outlet } from "react-router-dom";
import { getDashboardPathForRole, useAuth } from "@/src/context/AuthContext";
import type { UserRole } from "@/src/types";

export function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}

export function RoleProtectedRoute({ allowedRole }: { allowedRole: UserRole }) {
  const { currentUser } = useAuth();
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }
  if (currentUser.role !== allowedRole) {
    return <Navigate to={getDashboardPathForRole(currentUser.role)} replace />;
  }
  return <Outlet />;
}

export function GuestOnlyRoute() {
  const { currentUser } = useAuth();
  if (currentUser) {
    return <Navigate to={getDashboardPathForRole(currentUser.role)} replace />;
  }
  return <Outlet />;
}
