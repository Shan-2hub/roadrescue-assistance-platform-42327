import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import MapPreview from "../components/MapPreview";
import { useRequests } from "../contexts/RequestsContext";
import { geocodeAddress } from "../lib/geocoding";

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

  const handleFindMyLocation = async () => {
    setMsg({ type: "", text: "" });

    const address = String(form.address || "").trim();
    if (!address) {
      setMsg({ type: "error", text: "Please enter an address first." });
      return;
    }

    setBusy(true);
    try {
      const location = await geocodeAddress(address);
      setForm((p) => ({
        ...p,
        latitude: location.lat.toFixed(6),
        longitude: location.lon.toFixed(6),
        // Replace with the canonical display_name, but keep something if API returns none.
        address: location.displayName || p.address,
      }));
      setMsg({ type: "success", text: "Location found from address." });
    } catch (err) {
      setMsg({ type: "error", text: "Could not find location. Please enter a valid address." });
    } finally {
      setBusy(false);
    }
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
        <h1>Submit a breakdown request</h1>
        <p className="rr-muted">Please fill in vehicle, issue, contact and your current breakdown location.</p>

        {msg.text ? (
          <div className={`rr-alert ${msg.type === "error" ? "rr-alert-error" : msg.type === "success" ? "rr-alert-success" : ""}`}>
            {msg.text}
          </div>
        ) : null}

        <form className="rr-form" onSubmit={onSubmit} style={{ marginTop: 12 }}>
          <h3>Request details</h3>

          <div className="rr-row" style={{ alignItems: "stretch" }}>
            <div className="rr-field" style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="make">Make</label>
              <input id="make" value={form.make} onChange={(e) => setField("make", e.target.value)} placeholder="Toyota" />
            </div>
            <div className="rr-field" style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="model">Model</label>
              <input id="model" value={form.model} onChange={(e) => setField("model", e.target.value)} placeholder="Corolla" />
            </div>
          </div>

          <div className="rr-row" style={{ alignItems: "stretch" }}>
            <div className="rr-field" style={{ flex: 1, minWidth: 180 }}>
              <label htmlFor="year">Year</label>
              <input
                id="year"
                value={form.year}
                onChange={(e) => setField("year", e.target.value)}
                inputMode="numeric"
                placeholder="2017"
              />
            </div>
            <div className="rr-field" style={{ flex: 1, minWidth: 180 }}>
              <label htmlFor="bought">Bought</label>
              <input id="bought" value={form.bought} onChange={(e) => setField("bought", e.target.value)} placeholder="2021" />
              <div className="rr-help">Optional.</div>
            </div>
          </div>

          <div className="rr-field">
            <label htmlFor="licensePlate">License plate</label>
            <input
              id="licensePlate"
              value={form.licensePlate}
              onChange={(e) => setField("licensePlate", e.target.value)}
              placeholder="ABC-1234"
            />
          </div>

          <div className="rr-field">
            <label htmlFor="issueDescription">Issue description</label>
            <textarea
              id="issueDescription"
              value={form.issueDescription}
              onChange={(e) => setField("issueDescription", e.target.value)}
              placeholder="Describe the issue (engine won't start, flat tire, etc.)"
            />
          </div>

          <div className="rr-row" style={{ alignItems: "stretch" }}>
            <div className="rr-field" style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="contactName">Contact name</label>
              <input
                id="contactName"
                value={form.contactName}
                onChange={(e) => setField("contactName", e.target.value)}
                placeholder="Your name"
              />
            </div>
            <div className="rr-field" style={{ flex: 1, minWidth: 220 }}>
              <label htmlFor="contactPhone">Contact phone number</label>
              <input
                id="contactPhone"
                value={form.contactPhone}
                onChange={(e) => setField("contactPhone", e.target.value)}
                placeholder="+1 555 123 4567"
              />
            </div>
          </div>

          <h3>Location</h3>

          <div className="rr-field">
            <label htmlFor="address">Address</label>
            <input
              id="address"
              value={form.address}
              onChange={(e) => setField("address", e.target.value)}
              placeholder="Enter your breakdown location"
            />
            <div className="rr-help">Enter an address, then click “Find my location” to auto-fill coordinates.</div>
          </div>

          <div className="rr-row" style={{ alignItems: "stretch" }}>
            <div className="rr-field" style={{ flex: 1, minWidth: 160 }}>
              <label htmlFor="latitude">Latitude</label>
              <input
                id="latitude"
                value={form.latitude}
                onChange={(e) => setField("latitude", e.target.value)}
                placeholder="e.g., 37.774900"
                inputMode="decimal"
              />
            </div>
            <div className="rr-field" style={{ flex: 1, minWidth: 160 }}>
              <label htmlFor="longitude">Longitude</label>
              <input
                id="longitude"
                value={form.longitude}
                onChange={(e) => setField("longitude", e.target.value)}
                placeholder="e.g., -122.419400"
                inputMode="decimal"
              />
            </div>

            <div style={{ display: "flex", alignItems: "end" }}>
              <button className="rr-btn rr-btn-secondary rr-btn-medium" type="button" onClick={handleFindMyLocation} disabled={busy}>
                {busy ? "Finding…" : "Find my location"}
              </button>
            </div>
          </div>

          <div className="rr-row" style={{ marginTop: 6 }}>
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
        <h2>Location Map</h2>
        <p className="rr-muted">Map will update after you click “Find my location”.</p>
        <MapPreview latitude={form.latitude} longitude={form.longitude} height={360} hint="Powered by OpenStreetMap tiles." />
      </aside>
    </div>
  );
}
