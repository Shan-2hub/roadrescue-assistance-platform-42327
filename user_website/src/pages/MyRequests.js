import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import StatusPill from "../components/StatusPill";
import { useRequests } from "../contexts/RequestsContext";

/**
 * PUBLIC_INTERFACE
 * Shows user's requests list. Clicking request ID opens the detail view.
 */
export default function MyRequests() {
  const { requests, refreshFromBackend } = useRequests();
  const [busy, setBusy] = useState(false);

  const visible = useMemo(() => requests || [], [requests]);

  const onRefresh = async () => {
    setBusy(true);
    await refreshFromBackend();
    setBusy(false);
  };

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <div className="rr-row">
          <div>
            <h1>My Requests</h1>
            <p className="rr-muted">View requests you’ve made. Click a request ID to see full details.</p>
          </div>
          <button className="rr-btn" onClick={onRefresh} disabled={busy}>
            {busy ? "Refreshing…" : "Refresh"}
          </button>
        </div>

        {visible.length === 0 ? (
          <div className="rr-alert" style={{ marginTop: 12 }}>
            No requests yet. Go to <Link to="/submit">Submit Request</Link> to create one.
          </div>
        ) : (
          <ul className="rr-list" style={{ marginTop: 12 }}>
            {visible.map((r) => (
              <li className="rr-list-item" key={r.id}>
                <div className="rr-row">
                  <div>
                    <div>
                      Request ID: <Link to={`/requests/${r.id}`}>{r.id}</Link>
                    </div>
                    <div className="rr-muted" style={{ marginTop: 4 }}>
                      {r.vehicle?.make} {r.vehicle?.model} · {r.vehicle?.year} · {r.vehicle?.licensePlate}
                    </div>
                  </div>
                  <StatusPill status={r.status} />
                </div>

                <div className="rr-muted" style={{ fontSize: 13 }}>
                  Created: {new Date(r.createdAt).toLocaleString()}
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      <aside className="rr-card">
        <h2>Status updates</h2>
        <p className="rr-muted">
          Once backend wiring is added, this page will reflect updates from the mechanic portal automatically.
        </p>
        <div className="rr-alert">
          You’ll see:
          <ul style={{ margin: "8px 0 0 18px" }}>
            <li>“Mechanic accepted your request” → Assigned</li>
            <li>“Service completed” → Completed</li>
          </ul>
        </div>
      </aside>
    </div>
  );
}
