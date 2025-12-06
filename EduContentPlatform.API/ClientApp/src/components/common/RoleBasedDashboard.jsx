import React from "react";
import { Navigate } from "react-router-dom";

const RoleBasedDashboard = () => {
    debugger
  const rawUser = localStorage.getItem("user");
  const user = rawUser ? JSON.parse(rawUser) : null;
  if (!user) return <Navigate to="/login" />;

  const role = (user.displayName || user.displayName?.[0] || "").toLowerCase();

  switch (role) {
  
    case "admin":
      return <Navigate to="/admin" />;

    case "teacher":
      return <Navigate to="/teacher/courses" />;

    case "scholar":
    case "publisher":
      return <Navigate to="/dashboard/publications" />;

    case "editor":
    case "reviewer":
      return <Navigate to="/editorial" />;

    default:
      return <Navigate to="/" />;
  }
};

export default RoleBasedDashboard;
