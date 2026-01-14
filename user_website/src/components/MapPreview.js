import React from "react";

/**
 * PUBLIC_INTERFACE
 * MVP map placeholder. Shows lat/lng and a message.
 * In a later iteration, this would render an actual map view (without external APIs per MVP scope).
 */
export default function MapPreview({ latitude, longitude, hint }) {
  const lat = latitude !== undefined && latitude !== null && String(latitude).trim() !== "" ? String(latitude) : "—";
  const lng = longitude !== undefined && longitude !== null && String(longitude).trim() !== "" ? String(longitude) : "—";

  return (
    <div className="rr-map" role="img" aria-label="Map preview placeholder">
      <div>
        <div>
          <strong>Map preview (MVP)</strong>
        </div>
        <div className="rr-muted" style={{ marginTop: 8 }}>
          Latitude: <strong>{lat}</strong> · Longitude: <strong>{lng}</strong>
        </div>
        {hint ? (
          <div className="rr-muted" style={{ marginTop: 8 }}>
            {hint}
          </div>
        ) : null}
      </div>
    </div>
  );
}
