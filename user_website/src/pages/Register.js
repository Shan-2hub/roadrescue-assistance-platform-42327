import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * PUBLIC_INTERFACE
 * Register page (email/password + Google).
 */
export default function Register() {
  const { signUpWithPassword, signInWithGoogle, authError } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [localError, setLocalError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setLocalError("");
    setSuccessMsg("");

    if (!email || !password) {
      setLocalError("Please enter email and password.");
      return;
    }
    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters.");
      return;
    }

    setBusy(true);
    const { error } = await signUpWithPassword({ email, password });
    setBusy(false);

    if (!error) {
      setSuccessMsg("Registration successful. Please check your email for confirmation (if enabled), then log in.");
      // Navigate to login for a clean MVP flow.
      setTimeout(() => navigate("/login"), 650);
    }
  };

  const onGoogle = async () => {
    setBusy(true);
    await signInWithGoogle();
    setBusy(false);
  };

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <h1>Register</h1>
        <p className="rr-muted">Create an account to submit and track your RoadRescue requests.</p>

        {successMsg ? <div className="rr-alert rr-alert-success">{successMsg}</div> : null}
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
              autoComplete="new-password"
              required
            />
            <div className="rr-help">Minimum 6 characters.</div>
          </div>

          <div className="rr-row">
            <button className="rr-btn rr-btn-primary" disabled={busy} type="submit">
              {busy ? "Creating…" : "Create account"}
            </button>

            <button className="rr-btn" disabled={busy} type="button" onClick={onGoogle}>
              Register with Google
            </button>
          </div>

          <p className="rr-footer-note">
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </form>
      </section>

      <aside className="rr-card">
        <h2>Security</h2>
        <p className="rr-muted">Auth is handled through Supabase. Your password is never stored directly by this frontend.</p>
      </aside>
    </div>
  );
}
