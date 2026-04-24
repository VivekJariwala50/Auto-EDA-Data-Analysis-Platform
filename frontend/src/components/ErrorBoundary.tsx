import React from "react";
import { useRouteError, isRouteErrorResponse, useNavigate } from "react-router-dom";
import { AlertTriangle, RotateCcw, Home } from "lucide-react";

// ── Route Error Page (used by errorElement in router) ────────────────────────
export function RouteErrorPage() {
  const error = useRouteError();
  const navigate = useNavigate();

  let message = "An unexpected error occurred.";
  let detail = "";

  if (isRouteErrorResponse(error)) {
    message = `${error.status} – ${error.statusText}`;
    detail = error.data;
  } else if (error instanceof Error) {
    message = error.message;
    detail = error.stack?.split("\n").slice(0, 4).join("\n") ?? "";
  }

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
      padding: "2rem",
    }}>
      <div style={{
        maxWidth: 480,
        width: "100%",
        background: "var(--bg-elevated)",
        border: "1px solid var(--border)",
        borderRadius: "var(--radius-xl)",
        padding: "2.5rem 2rem",
        textAlign: "center",
        boxShadow: "var(--shadow-lg)",
      }}>
        <div style={{
          width: 56, height: 56,
          borderRadius: "var(--radius-lg)",
          background: "rgba(239,68,68,0.1)",
          display: "flex", alignItems: "center", justifyContent: "center",
          margin: "0 auto 1.25rem",
          color: "var(--error)",
        }}>
          <AlertTriangle size={28} />
        </div>
        <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
          Something went wrong
        </h1>
        <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.25rem" }}>
          {message}
        </p>
        {detail && (
          <pre style={{
            background: "var(--bg-subtle)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-md)",
            padding: "0.875rem",
            fontSize: "0.75rem",
            color: "var(--text-muted)",
            textAlign: "left",
            overflowX: "auto",
            marginBottom: "1.5rem",
            whiteSpace: "pre-wrap",
            wordBreak: "break-word",
          }}>
            {detail}
          </pre>
        )}
        <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center" }}>
          <button
            className="btn btn-secondary"
            onClick={() => window.location.reload()}
          >
            <RotateCcw size={15} /> Reload
          </button>
          <button
            className="btn btn-primary"
            onClick={() => navigate("/")}
          >
            <Home size={15} /> Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Class Error Boundary (catches runtime render errors) ──────────────────────
interface State { hasError: boolean; error: Error | null }

export class ErrorBoundary extends React.Component<{ children: React.ReactNode }, State> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("[ErrorBoundary]", error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "var(--bg)",
          padding: "2rem",
        }}>
          <div style={{
            maxWidth: 480,
            width: "100%",
            background: "var(--bg-elevated)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius-xl)",
            padding: "2.5rem 2rem",
            textAlign: "center",
            boxShadow: "var(--shadow-lg)",
          }}>
            <div style={{
              width: 56, height: 56,
              borderRadius: "var(--radius-lg)",
              background: "rgba(239,68,68,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              margin: "0 auto 1.25rem",
              color: "var(--error)",
            }}>
              <AlertTriangle size={28} />
            </div>
            <h1 style={{ fontSize: "1.25rem", fontWeight: 700, marginBottom: "0.5rem", color: "var(--text-primary)" }}>
              Render Error
            </h1>
            <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "1.5rem" }}>
              {this.state.error?.message ?? "An unexpected error occurred while rendering."}
            </p>
            <button
              className="btn btn-primary"
              onClick={() => { this.setState({ hasError: false, error: null }); window.location.href = "/"; }}
            >
              <Home size={15} /> Return to Home
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
