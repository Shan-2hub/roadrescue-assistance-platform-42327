import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

function isConfigured() {
  return Boolean(supabaseUrl && supabaseAnonKey);
}

/**
 * When env vars are missing (common in CI/unit tests), Supabase's createClient throws.
 * We provide a minimal stub so the app can render and tests can run, while still
 * logging a clear configuration error.
 */
function createStubClient() {
  const thrower = async () => {
    throw new Error(
      "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in user_website .env"
    );
  };

  return {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signInWithPassword: thrower,
      signUp: thrower,
      signInWithOAuth: thrower,
      signOut: async () => ({ error: null }),
    },
  };
}

/**
 * PUBLIC_INTERFACE
 * Supabase client used across the user_website for Auth and (later) data APIs.
 */
export const supabase = (() => {
  if (!isConfigured()) {
    // eslint-disable-next-line no-console
    console.error(
      "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in user_website .env"
    );
    return createStubClient();
  }

  return createClient(supabaseUrl, supabaseAnonKey);
})();
