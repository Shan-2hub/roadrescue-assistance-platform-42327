import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const RequestsContext = createContext(null);

const STORAGE_KEY = "roadrescue:user_requests:v1";

function safeJsonParse(value, fallback) {
  try {
    return JSON.parse(value);
  } catch {
    return fallback;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function normalizeStatus(status) {
  const s = (status || "").toLowerCase();
  if (s === "assigned") return "assigned";
  if (s === "completed") return "completed";
  return "open";
}

/**
 * PUBLIC_INTERFACE
 * Hook to access request data/actions (MVP local persistence).
 */
export function useRequests() {
  return useContext(RequestsContext);
}

/**
 * PUBLIC_INTERFACE
 * Requests provider.
 *
 * MVP note:
 * - Stores requests in localStorage scoped to the browser (per-user session email if available).
 * - Later this will be replaced by backend APIs.
 */
export function RequestsProvider({ children, currentUserId }) {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    const parsed = safeJsonParse(raw, []);
    setRequests(Array.isArray(parsed) ? parsed : []);
  }, []);

  useEffect(() => {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(requests));
  }, [requests]);

  // PUBLIC_INTERFACE
  const createRequest = useCallback(
    (payload) => {
      const newReq = {
        id: uuidv4(),
        createdAt: nowIso(),
        status: "open",
        userId: currentUserId || "anonymous",
        vehicle: {
          make: payload.make || "",
          model: payload.model || "",
          year: payload.year || "",
          bought: payload.bought || "",
          licensePlate: payload.licensePlate || "",
        },
        issueDescription: payload.issueDescription || "",
        contact: {
          name: payload.contactName || "",
          phone: payload.contactPhone || "",
        },
        location: {
          address: payload.address || "",
          latitude: payload.latitude || "",
          longitude: payload.longitude || "",
        },
        // Mechanic-side linkage (later): mechanicId, assignedAt, completedAt, etc.
      };

      setRequests((prev) => [newReq, ...prev]);
      return newReq;
    },
    [currentUserId]
  );

  // PUBLIC_INTERFACE
  const getRequestById = useCallback(
    (id) => {
      return requests.find((r) => r.id === id) || null;
    },
    [requests]
  );

  // PUBLIC_INTERFACE
  const updateRequestStatus = useCallback((id, nextStatus) => {
    const status = normalizeStatus(nextStatus);
    setRequests((prev) =>
      prev.map((r) => {
        if (r.id !== id) return r;
        return { ...r, status };
      })
    );
  }, []);

  // PUBLIC_INTERFACE
  const refreshFromBackend = useCallback(async () => {
    /**
     * MVP placeholder for later integration.
     * Intended behavior:
     * - GET /requests?userId=currentUserId
     * - Update statuses based on mechanic actions (accept -> assigned, complete -> completed)
     */
    return { ok: true };
  }, []);

  const value = useMemo(
    () => ({
      requests,
      createRequest,
      getRequestById,
      updateRequestStatus,
      refreshFromBackend,
    }),
    [requests, createRequest, getRequestById, updateRequestStatus, refreshFromBackend]
  );

  return <RequestsContext.Provider value={value}>{children}</RequestsContext.Provider>;
}
