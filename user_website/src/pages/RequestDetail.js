import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import MapPreview from "../components/MapPreview";
import StatusPill from "../components/StatusPill";
import { useRequests } from "../contexts/RequestsContext";

/**
 * PUBLIC_INTERFACE
 * Request detail view: shows submitted details and a map preview of user's CURRENT location (per spec).
 */
export default function RequestDetail() {
  const { id } = useParams();
  const { getRequestById } = useRequests();
  const request = useMemo(() => getRequestById(id), [getRequestById, id]);

  const [currentLoc, setCurrentLoc] = useState({ lat: "", lng: "", error: "" });
  const [locBusy, setLocBusy] = useState(false);

  useEffect(() => {
    // Per spec: show current location map on detail view (not the request's saved location).
    if (!navigator.geolocation) {
      setCurrentLoc((p) => ({ ...p, error: "Geolocation is not supported in this browser." }));
      return;
    }

    setLocBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCurrentLoc({
          lat: pos.coords.latitude.toFixed(6),
          lng: pos.coords.longitude.toFixed(6),
          error: "",
        });
        setLocBusy(false);
      },
      (err) => {
        setCurrentLoc((p) => ({ ...p, error: err.message || "Unable to retrieve your location." }));
        setLocBusy(false);
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  }, []);

  if (!request) {
    return (
      <div className="rr-card">
        <h1>Request not found</h1>
        <p className="rr-muted">This request ID does not exist in this browser’s stored requests.</p>
        <Link className="rr-btn rr-btn-primary" to="/requests">
          Back to My Requests
        </Link>
      </div>
    );
  }

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <div className="rr-row">
          <div>
            <h1>Request Details</h1>
            <p className="rr-muted">
              ID: <strong>{request.id}</strong>
            </p>
          </div>
          <StatusPill status={request.status} />
        </div>

        <div className="rr-alert" style={{ marginTop: 12 }}>
          <strong>Status logic:</strong> Open → Assigned (mechanic accepted) → Completed (mechanic completed).
        </div>

        <h3 style={{ marginTop: 16 }}>Vehicle</h3>
        <dl className="rr-kv">
          <dt>Make</dt>
          <dd>{request.vehicle?.make || "—"}</dd>
          <dt>Model</dt>
          <dd>{request.vehicle?.model || "—"}</dd>
          <dt>Year</dt>
          <dd>{request.vehicle?.year || "—"}</dd>
          <dt>Bought</dt>
          <dd>{request.vehicle?.bought || "—"}</dd>
          <dt>License plate</dt>
          <dd>{request.vehicle?.licensePlate || "—"}</dd>
        </dl>

        <h3 style={{ marginTop: 16 }}>Issue</h3>
        <div className="rr-alert" style={{ background: "rgba(17,24,39,0.03)" }}>
          {request.issueDescription || "—"}
        </div>

        <h3 style={{ marginTop: 16 }}>Contact</h3>
        <dl className="rr-kv">
          <dt>Name</dt>
          <dd>{request.contact?.name || "—"}</dd>
          <dt>Phone</dt>
          <dd>{request.contact?.phone || "—"}</dd>
        </dl>

        <h3 style={{ marginTop: 16 }}>Breakdown location (submitted)</h3>
        <dl className="rr-kv">
          <dt>Address</dt>
          <dd>{request.location?.address || "—"}</dd>
          <dt>Latitude</dt>
          <dd>{request.location?.latitude || "—"}</dd>
          <dt>Longitude</dt>
          <dd>{request.location?.longitude || "—"}</dd>
        </dl>

        <div className="rr-footer-note">
          Per MVP spec: the map preview on this screen shows your <strong>current</strong> location, not the submitted location.
        </div>

        <div className="rr-row" style={{ marginTop: 14 }}>
          <Link className="rr-btn" to="/requests">
            Back to My Requests
          </Link>
          <Link className="rr-btn rr-btn-primary" to="/submit">
            Submit another request
          </Link>
        </div>
      </section>

      <aside className="rr-card">
        <h2>Your current location</h2>
        <p className="rr-muted">Used for on-screen visibility. No external map APIs are used.</p>

        {currentLoc.error ? <div className="rr-alert rr-alert-error">{currentLoc.error}</div> : null}
        {locBusy ? <div className="rr-alert">Fetching current location…</div> : null}

        <MapPreview
          latitude={currentLoc.lat}
          longitude={currentLoc.lng}
          hint="Current location preview (MVP placeholder)."
        />
      </aside>
    </div>
  );
}
