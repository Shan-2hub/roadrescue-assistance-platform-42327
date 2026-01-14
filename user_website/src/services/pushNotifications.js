/**
 * RoadRescue push notification groundwork (MVP).
 *
 * This intentionally does not integrate a real push provider yet. It provides:
 * - capability checks
 * - permission request
 * - a future hook for registering device tokens with backend API
 */

function isBrowser() {
  return typeof window !== "undefined";
}

/**
 * PUBLIC_INTERFACE
 * Returns true if browser supports the Notifications API.
 */
export function isNotificationsSupported() {
  return isBrowser() && "Notification" in window;
}

/**
 * PUBLIC_INTERFACE
 * Requests notifications permission from the user.
 */
export async function requestNotificationPermission() {
  if (!isNotificationsSupported()) return { supported: false, permission: "unsupported" };
  const permission = await window.Notification.requestPermission();
  return { supported: true, permission };
}

/**
 * PUBLIC_INTERFACE
 * Placeholder for registering a push token with backend.
 * In a later iteration this would POST token to `${REACT_APP_API_BASE}/push/register`.
 */
export async function registerPushTokenWithBackend(_token, _userId) {
  return { ok: true };
}
