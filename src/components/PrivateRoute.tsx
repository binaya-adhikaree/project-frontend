import {type ReactNode } from "react";
import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

interface Props {
  role: string;
  children: ReactNode;
}

export default function PrivateRoute({ role, children }: Props) {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/login" />;

  if (user.role !== role) {
    // Redirect to correct dashboard if role mismatches
    if (user.role === "GASTRONOM") return <Navigate to="/user" />;
    if (user.role === "ADMIN") return <Navigate to="/admin" />;

    return <Navigate to="/login" />;
  }
  return <>{children}</>;
}
