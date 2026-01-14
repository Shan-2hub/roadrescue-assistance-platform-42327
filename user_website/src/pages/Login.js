import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Login page (email/password + Google).
 */
export default function Login() {
  const { signInWithPassword, signInWithGoogle, authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const nextPath = location.state?.from || "/submit";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");

    if (!email || !password) {
      setLocalError("Please enter email and password.");
      return;
    }

    setBusy(true);
    const { error } = await signInWithPassword({ email, password });
    setBusy(false);

    if (!error) navigate(nextPath);
  };

  const onGoogle = async () => {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
    // OAuth redirect occurs; navigation is handled after redirect.
  };

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <h1>Login</h1>
        <p className="rr-muted">Sign in to submit a breakdown request and track your status.</p>

        {(localError || authError) && <div className="rr-alert rr-alert-error">{localError || authError}</div>}

        <form className="rr-form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <div className="rr-field">
            <label htmlFor="email">Email</label>
            <input id="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" autoComplete="email" required />
          </div>

          <div className="rr-field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          <div className="rr-row">
            <button className="rr-btn rr-btn-primary" disabled={busy} type="submit">
              {busy ? "Signing in…" : "Login"}
            </button>

            <button className="rr-btn" disabled={busy} type="button" onClick={onGoogle}>
              Sign in with Google
            </button>
          </div>

          <p className="rr-footer-note">
            New here? <Link to="/register">Register</Link>
          </p>
        </form>
      </section>

      <aside className="rr-card">
        <h2>Why sign in?</h2>
        <p className="rr-muted">RoadRescue uses your account to show only your own requests in “My Requests”.</p>
      </aside>
    </div>
  );
}
