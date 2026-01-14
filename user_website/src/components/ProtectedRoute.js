import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Wraps a route element and redirects to /login if user is not authenticated.
 */
export default function ProtectedRoute({ children }) {
  const { user, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return (
      <div className="rr-card">
        <h2>Loading…</h2>
        <p className="rr-muted">Preparing your session.</p>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;

  return children;
}
