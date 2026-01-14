import React from "react";

/**
 * PUBLIC_INTERFACE
 * About page.
 */
export default function About() {
  return (
    <div className="rr-card">
      <h1>About RoadRescue</h1>
      <p className="rr-muted">
        RoadRescue is an MVP platform to connect drivers experiencing breakdowns with available mechanics. Submit your vehicle and issue
        details, share your location, and track status updates from <strong>Open</strong> to <strong>Assigned</strong> to{" "}
        <strong>Completed</strong>.
      </p>

      <h2 style={{ marginTop: 16 }}>Status flow</h2>
      <ul className="rr-muted">
        <li>
          <strong>Open</strong>: You created the request.
        </li>
        <li>
          <strong>Assigned</strong>: A mechanic accepted the job (mechanic portal action).
        </li>
        <li>
          <strong>Completed</strong>: Mechanic marked the job completed.
        </li>
      </ul>

      <p className="rr-footer-note">
        Push notifications groundwork is included for future integration (e.g., “mechanic accepted your request”, “service completed”).
      </p>
    </div>
  );
}
