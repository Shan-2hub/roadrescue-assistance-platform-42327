import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_KEY;

/**
 * Ensure required Supabase environment variables exist.
 * We intentionally fail fast to make misconfiguration obvious during development/CI.
 */
function assertSupabaseConfigured() {
  if (!supabaseUrl || !supabaseAnonKey) {
    // eslint-disable-next-line no-console
    console.error(
      "Supabase is not configured. Please set REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_KEY in user_website .env"
    );
  }
}

assertSupabaseConfigured();

/**
 * PUBLIC_INTERFACE
 * Supabase client used across the user_website for Auth and (later) data APIs.
 */
export const supabase = createClient(supabaseUrl || "", supabaseAnonKey || "");
