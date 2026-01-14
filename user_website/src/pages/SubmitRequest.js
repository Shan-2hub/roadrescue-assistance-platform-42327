import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapPreview from "../components/MapPreview";
import { useRequests } from "../contexts/RequestsContext";

/**
 * PUBLIC_INTERFACE
 * Submit Request page.
 */
export default function SubmitRequest() {
  const navigate = useNavigate();
  const { createRequest } = useRequests();

  const [form, setForm] = useState({
    make: "",
    model: "",
    year: "",
    bought: "",
    licensePlate: "",
    issueDescription: "",
    contactName: "",
    contactPhone: "",
    address: "",
    latitude: "",
    longitude: "",
  });

  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: "", text: "" });

  const canSubmit = useMemo(() => {
    return (
      form.make &&
      form.model &&
      form.year &&
      form.licensePlate &&
      form.issueDescription &&
      form.contactName &&
      form.contactPhone &&
      form.address &&
      form.latitude &&
      form.longitude
    );
  }, [form]);

  const setField = (key, value) => setForm((p) => ({ ...p, [key]: value }));

  const useMyLocation = () => {
    setMsg({ type: "", text: "" });

    if (!navigator.geolocation) {
      setMsg({ type: "error", text: "Geolocation is not supported in this browser." });
      return;
    }

    setBusy(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude.toFixed(6);
        const lng = pos.coords.longitude.toFixed(6);

        // MVP: No external reverse geocoding (per project constraints). We still populate a helpful address string.
        setForm((p) => ({
          ...p,
          latitude: lat,
          longitude: lng,
          address: p.address || `Lat ${lat}, Lng ${lng}`,
        }));
        setBusy(false);
        setMsg({ type: "success", text: "Location captured. Please confirm/edit the address field if needed." });
      },
      (err) => {
        setBusy(false);
        setMsg({ type: "error", text: err.message || "Unable to retrieve your location." });
      },
      { enableHighAccuracy: true, timeout: 12000 }
    );
  };

  const onSubmit = (e) => {
    e.preventDefault();
    setMsg({ type: "", text: "" });

    if (!canSubmit) {
      setMsg({ type: "error", text: "Please fill all fields (including location latitude/longitude)." });
      return;
    }

    setBusy(true);
    const req = createRequest(form);
    setBusy(false);

    setMsg({ type: "success", text: `Request submitted. Status is OPEN. Request ID: ${req.id}` });
    setTimeout(() => navigate(`/requests/${req.id}`), 700);
  };

  return (
    <div className="rr-grid">
      <section className="rr-card">
        <h1>Submit Request</h1>
        <p className="rr-muted">Provide your vehicle info, issue details, contact details, and breakdown location.</p>

        {msg.text ? (
          <div className={`rr-alert ${msg.type === "error" ? "rr-alert-error" : msg.type === "success" ? "rr-alert-success" : ""}`}>
            {msg.text}
          </div>
        ) : null}

        <form className="rr-form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <h3>Vehicle</h3>

          <div className="rr-field">
            <label htmlFor="make">Make (brand)</label>
            <input id="make" value={form.make} onChange={(e) => setField("make", e.target.value)} placeholder="e.g., Toyota" />
          </div>

          <div className="rr-field">
            <label htmlFor="model">Model</label>
            <input id="model" value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="e.g., Corolla" />
          </div>

          <div className="rr-field">
            <label htmlFor="year">Year</label>
            <input
              id="year"
              value={form.year}
              onChange={(e) => setField("year", e.target.value)}
              inputMode="numeric"
              placeholder="e.g., 2017"
            />
          </div>

          <div className="rr-field">
            <label htmlFor="bought">Bought</label>
            <input id="bought" value={form.bought} onChange={(e) => setField("bought", e.target.value)} placeholder="e.g., 2021 (optional)" />
            <div className="rr-help">Optional field for purchase year/date.</div>
          </div>

          <div className="rr-field">
            <label htmlFor="licensePlate">License plate</label>
            <input
              id="licensePlate"
              value={form.licensePlate}
              onChange={(e) => setField("licensePlate", e.target.value)}
              placeholder="e.g., ABC-1234"
            />
          </div>

          <h3>Issue</h3>
          <div className="rr-field">
            <label htmlFor="issueDescription">Issue description</label>
            <textarea
              id="issueDescription"
              value={form.issueDescription}
              onChange={(e) => setField("issueDescription", e.target.value)}
              placeholder="Describe the issue (e.g., engine won't start, flat tire...)"
            />
          </div>

          <h3>Contact</h3>
          <div className="rr-field">
            <label htmlFor="contactName">Contact name</label>
            <input id="contactName" value={form.contactName} onChange={(e) => setField("contactName", e.target.value)} placeholder="Your name" />
          </div>

          <div className="rr-field">
            <label htmlFor="contactPhone">Contact phone number</label>
            <input
              id="contactPhone"
              value={form.contactPhone}
              onChange={(e) => setField("contactPhone", e.target.value)}
              placeholder="e.g., +1 555 123 4567"
            />
          </div>

          <h3>Location</h3>
          <div className="rr-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Address or helpful landmark"
            />
            <div className="rr-help">You can type an address, and/or use “Use my location” to auto-fill coordinates.</div>
          </div>

          <div className="rr-row">
            <div className="rr-field" style={{ flex: 1, minWidth: 160 }}>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                placeholder="e.g., 37.7749"
                inputMode="decimal"
              />
            </div>
            <div className="rr-field" style={{ flex: 1, minWidth: 160 }}>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                placeholder="e.g., -122.4194"
                inputMode="decimal"
              />
            </div>
          </div>

          <div className="rr-row">
            <button className="rr-btn rr-btn-secondary" type="button" onClick={useMyLocation} disabled={busy}>
              Use my location
            </button>
            <button className="rr-btn rr-btn-primary" type="submit" disabled={busy}>
              {busy ? "Submitting…" : "Submit request"}
            </button>
          </div>

          <div className="rr-footer-note">
            When you submit, status starts as <strong>Open</strong>. It becomes <strong>Assigned</strong> when a mechanic accepts, and{" "}
            <strong>Completed</strong> when finished.
          </div>
        </form>
      </section>

      <aside className="rr-card">
        <h2>Map</h2>
        <p className="rr-muted">After “Use my location”, the preview will show your coordinates.</p>
        <MapPreview
          latitude={form.latitude}
          longitude={form.longitude}
          hint="In a later version, this will display a map. For MVP, no external map APIs are used."
        />
      </aside>
    </div>
  );
}
