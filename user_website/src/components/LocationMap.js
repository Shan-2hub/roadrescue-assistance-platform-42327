import React, { useMemo } from "react";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";

import "leaflet/dist/leaflet.css";

// Fix default marker icons under bundlers like CRA/Webpack.
// Ref: Leaflet docs / common workaround.
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

// PUBLIC_INTERFACE
export default function LocationMap({ lat, lon, height = 320, popupText = "Breakdown location" }) {
  /** Reusable Leaflet map component displaying a single marker for given lat/lon. */
  const numeric = useMemo(() => {
    const nLat = typeof lat === "string" ? Number(lat) : lat;
    const nLon = typeof lon === "string" ? Number(lon) : lon;
    if (!Number.isFinite(nLat) || !Number.isFinite(nLon)) return null;
    return { lat: nLat, lon: nLon };
  }, [lat, lon]);

  if (!numeric) return null;

  const center = [numeric.lat, numeric.lon];

  return (
    <div className="rr-leaflet-wrap" style={{ height }}>
      <MapContainer center={center} zoom={15} scrollWheelZoom style={{ height: "100%", width: "100%" }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center}>
          <Popup>{popupText}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
