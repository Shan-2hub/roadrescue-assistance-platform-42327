import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

function friendlyAuthError(err) {
  if (!err) return "";
  // Keep this minimal (MVP) but user-friendly.
  return err.message || "Authentication error. Please try again.";
}

/**
 * PUBLIC_INTERFACE
 * Hook to access the AuthContext.
 */
export function useAuth() {
  return useContext(AuthContext);
}

/**
 * PUBLIC_INTERFACE
 * Provides auth state + auth actions (email/password + Google).
 */
export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [initializing, setInitializing] = useState(true);
  const [authError, setAuthError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function init() {
      const { data, error } = await supabase.auth.getSession();
      if (!mounted) return;

      if (error) setAuthError(friendlyAuthError(error));
      setSession(data?.session || null);
      setInitializing(false);
    }

    init();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession || null);
    });

    return () => {
      mounted = false;
      listener?.subscription?.unsubscribe();
    };
  }, []);

  // PUBLIC_INTERFACE
  const signInWithPassword = async ({ email, password }) => {
    setAuthError("");
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setAuthError(friendlyAuthError(error));
    return { error };
  };

  // PUBLIC_INTERFACE
  const signUpWithPassword = async ({ email, password }) => {
    setAuthError("");
    const siteUrl = process.env.REACT_APP_FRONTEND_URL;

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // MVP: keeps us compliant with env-based deploy URLs.
        emailRedirectTo: siteUrl || undefined,
      },
    });

    if (error) setAuthError(friendlyAuthError(error));
    return { error };
  };

  // PUBLIC_INTERFACE
  const signInWithGoogle = async () => {
    setAuthError("");
    const siteUrl = process.env.REACT_APP_FRONTEND_URL;

    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: siteUrl || undefined,
      },
    });

    if (error) setAuthError(friendlyAuthError(error));
    return { error };
  };

  // PUBLIC_INTERFACE
  const signOut = async () => {
    setAuthError("");
    const { error } = await supabase.auth.signOut();
    if (error) setAuthError(friendlyAuthError(error));
    return { error };
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,
      initializing,
      authError,
      signInWithPassword,
      signUpWithPassword,
      signInWithGoogle,
      signOut,
    }),
    [session, initializing, authError]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
