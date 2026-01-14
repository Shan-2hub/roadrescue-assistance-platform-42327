import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Home page / landing dashboard.
 */
export default function Home() {
  const { user } = useAuth();

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <h1>RoadRescue</h1>
        <p className="rr-muted">
          Request quick assistance for vehicle breakdowns. Track the status as mechanics accept and complete your request.
        </p>

        <div className="rr-alert" style={{ marginTop: 12 }}>
          <strong>MVP note:</strong> Requests are stored locally for now. Status updates are designed to reflect mechanic actions once backend
          wiring is added.
        </div>

        <div className="rr-row" style={{ marginTop: 14 }}>
          <Link className="rr-btn rr-btn-primary" to="/submit">
            Submit a Request
          </Link>
          <Link className="rr-btn" to="/requests">
            View My Requests
          </Link>
        </div>
      </section>

      <aside className="rr-card">
        <h2>Your Account</h2>
        {user ? (
          <>
            <p className="rr-muted">You’re signed in as:</p>
            <div className="rr-alert">
              <strong>{user.email}</strong>
            </div>
            <p className="rr-footer-note">
              Tip: After submitting a request, go to <strong>My Requests</strong> and click the request ID to see full details.
            </p>
          </>
        ) : (
          <>
            <p className="rr-muted">Sign in to submit and track requests.</p>
            <div className="rr-row">
              <Link className="rr-btn rr-btn-primary" to="/login">
                Login
              </Link>
              <Link className="rr-btn rr-btn-secondary" to="/register">
                Register
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
