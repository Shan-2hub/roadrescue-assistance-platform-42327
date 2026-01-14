import React from "react";

function normalize(status) {
  const s = (status || "").toLowerCase();
  if (s === "assigned") return "assigned";
  if (s === "completed") return "completed";
  return "open";
}

/**
 * PUBLIC_INTERFACE
 * Displays a colored status pill matching request state.
 */
export default function StatusPill({ status }) {
  const s = normalize(status);
  const cls =
    s === "open" ? "rr-pill rr-pill-open" : s === "assigned" ? "rr-pill rr-pill-assigned" : "rr-pill rr-pill-completed";

  const label = s === "open" ? "Open" : s === "assigned" ? "Assigned" : "Completed";

  return <span className={cls}>{label}</span>;
}
