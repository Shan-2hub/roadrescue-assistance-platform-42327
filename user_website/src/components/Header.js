import React from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Top navigation with RoadRescue brand on the left and route links/auth controls on the right.
 */
export default function Header() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const email = user?.email || "";
  const short = email ? email.split("@")[0] : "Guest";

  const onLogout = async () => {
    await signOut();
    navigate("/login");
  };

  return (
    <header className="rr-header">
      <div className="rr-header-inner">
        <Link className="rr-brand" to="/">
          <span className="rr-logo-badge" aria-hidden="true">
            RR
          </span>
          <span className="rr-brand-text">
            <strong>RoadRescue</strong>
            <span>QuickAssist for breakdowns</span>
          </span>
        </Link>

        <nav className="rr-nav" aria-label="Primary">
          <NavLink to="/submit">Submit Request</NavLink>
          <NavLink to="/requests">My Requests</NavLink>
          <NavLink to="/about">About</NavLink>

          <div className="rr-nav-right">
            {user ? (
              <>
                <span className="rr-chip" title={email}>
                  <small>Signed in</small>
                  <strong>{short}</strong>
                </span>
                <button className="rr-btn rr-btn-secondary" onClick={onLogout}>
                  Logout
                </button>
              </>
            ) : (
              <>
                <NavLink to="/register">Register</NavLink>
                <NavLink to="/login">Login</NavLink>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
