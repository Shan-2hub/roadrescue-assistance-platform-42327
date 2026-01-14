import React from "react";
import LocationMap from "./LocationMap";

/**
 * PUBLIC_INTERFACE
 * MapPreview: renders a Leaflet map when valid lat/lon are available; otherwise shows a friendly placeholder box.
 */
export default function MapPreview({ latitude, longitude, hint, height }) {
  const latStr = latitude !== undefined && latitude !== null && String(latitude).trim() !== "" ? String(latitude) : "";
  const lonStr = longitude !== undefined && longitude !== null && String(longitude).trim() !== "" ? String(longitude) : "";

  const hasCoords = latStr !== "" && lonStr !== "" && Number.isFinite(Number(latStr)) && Number.isFinite(Number(lonStr));

  if (!hasCoords) {
    return (
      <div className="rr-map" role="img" aria-label="Map preview placeholder">
        <div>
          <div>
            <strong>Map</strong>
          </div>
          <div className="rr-muted" style={{ marginTop: 8 }}>
            Enter an address and click <strong>Find my location</strong> to show it on the map.
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

  return <LocationMap lat={latStr} lon={lonStr} height={height || 320} popupText="Breakdown location" />;
}
