/**
 * Nominatim geocoding helpers for RoadRescue.
 * Uses the public OpenStreetMap Nominatim API.
 */

// PUBLIC_INTERFACE
export async function geocodeAddress(address) {
  /** Convert a free-text address into latitude/longitude using Nominatim. */
  const trimmed = String(address || "").trim();
  if (!trimmed) throw new Error("Address is required");

  const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(trimmed)}`;

  const response = await fetch(url, {
    headers: {
      // As requested in the task instructions.
      "User-Agent": "RoadRescue-MVP/1.0",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding failed (${response.status})`);
  }

  const data = await response.json();
  if (!data || data.length === 0) {
    throw new Error("Address not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lon: parseFloat(data[0].lon),
    displayName: data[0].display_name,
  };
}
