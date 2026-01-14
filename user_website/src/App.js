import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { RequestsProvider } from "./contexts/RequestsContext";
import About from "./pages/About";
import Home from "./pages/Home";
import Login from "./pages/Login";
import MyRequests from "./pages/MyRequests";
import Register from "./pages/Register";
import RequestDetail from "./pages/RequestDetail";
import SubmitRequest from "./pages/SubmitRequest";

function AppProviders({ children }) {
  const { user } = useAuth();

  // Use supabase user id if available; fallback to email; fallback to anonymous.
  const userId = user?.id || user?.email || "anonymous";

  return <RequestsProvider currentUserId={userId}>{children}</RequestsProvider>;
}

/**
 * PUBLIC_INTERFACE
 * Root app entry for user_website. Implements:
 * - Branded header (RoadRescue)
 * - Auth (email/password + Google via Supabase)
 * - Submit Request flow with location capture + map placeholder
 * - My Requests list + detail view
 */
function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppShell />
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppShell() {
  return (
    <div className="rr-app">
      <Header />
      <main className="rr-main">
        <AppProviders>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            <Route
              path="/submit"
              element={
                <ProtectedRoute>
                  <SubmitRequest />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests"
              element={
                <ProtectedRoute>
                  <MyRequests />
                </ProtectedRoute>
              }
            />
            <Route
              path="/requests/:id"
              element={
                <ProtectedRoute>
                  <RequestDetail />
                </ProtectedRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AppProviders>
      </main>
    </div>
  );
}

export default App;
