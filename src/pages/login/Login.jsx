import React, { useState } from "react";

/**
 * Login.jsx
 * Sign-in screen for the Microfinance Controls / QC Verification system.
 * Single-column layout: the form is the whole page on a clean light
 * background, no side panel.
 *
 * Color tokens
 *   --mf-green   #16a34a   primary action / accents
 *   --mf-ink     #111827   headings
 *   --mf-bg      #f6f7f9   page background
 *   --mf-border  #e5e7eb
 *   --mf-muted   #6b7280
 */

// Base URL of the FastAPI backend (the ngrok tunnel shown in /docs).
// Move this to an env var (e.g. import.meta.env.VITE_API_BASE_URL or
// process.env.REACT_APP_API_BASE_URL) once you have a permanent domain.
const API_BASE_URL = "https://thread-quilt-unworn.ngrok-free.dev";

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Enter both username and password to continue.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      // The API returns JSON on both success and failure, so read the
      // body once and branch on response.ok rather than on the status
      // code alone.
      const data = await response.json().catch(() => null);

      if (!response.ok) {
        const message =
          (data && (data.detail || data.message)) ||
          (response.status === 401
            ? "Incorrect username or password."
            : "Sign-in failed. Please try again.");
        setError(typeof message === "string" ? message : "Sign-in failed. Please try again.");
        return;
      }

      // Expecting something like { access_token, token_type } from a
      // FastAPI auth route. Persist it so the rest of the app can call
      // protected endpoints, then hand off to the parent.
      if (data && data.access_token) {
        const storage = remember ? window.localStorage : window.sessionStorage;
        storage.setItem("mf_access_token", data.access_token);
      }

      if (onLogin) onLogin({ username, remember, ...data });
    } catch (err) {
      setError("Could not reach the server. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mf-page">
      <style>{`
        * { box-sizing: border-box; }

        .mf-page {
          min-height: 100vh;
          width: 100%;
          background: #f6f7f9;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Inter, Roboto, Helvetica, Arial, sans-serif;
          padding: 48px 24px;
        }

        .mf-form-wrap {
          width: 100%;
          max-width: 460px;
        }

        .mf-eyebrow {
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.09em;
          text-transform: uppercase;
          color: #16a34a;
          margin-bottom: 12px;
        }

        .mf-eyebrow span.dim {
          color: #9ca3af;
        }

        .mf-title {
          font-size: 30px;
          font-weight: 800;
          color: #111827;
          letter-spacing: -0.01em;
          margin: 0 0 10px;
        }

        .mf-subtitle {
          margin: 0 0 36px;
          font-size: 14.5px;
          color: #6b7280;
          line-height: 1.6;
        }

        .mf-field {
          margin-bottom: 20px;
        }

        .mf-label {
          display: block;
          font-size: 12.5px;
          font-weight: 700;
          color: #374151;
          margin-bottom: 7px;
        }

        .mf-input-wrap {
          position: relative;
        }

        .mf-input {
          width: 100%;
          padding: 13px 16px;
          font-size: 15px;
          color: #111827;
          background: #ffffff;
          border: 1.5px solid #e5e7eb;
          border-radius: 10px;
          outline: none;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
        }

        .mf-input:focus {
          border-color: #16a34a;
          box-shadow: 0 0 0 3px rgba(22, 163, 74, 0.12);
        }

        .mf-input::placeholder {
          color: #9ca3af;
        }

        .mf-toggle {
          position: absolute;
          right: 12px;
          top: 50%;
          transform: translateY(-50%);
          background: none;
          border: none;
          font-size: 12px;
          font-weight: 700;
          color: #16a34a;
          cursor: pointer;
          padding: 4px 6px;
        }

        .mf-toggle:hover { text-decoration: underline; }

        .mf-row-between {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin: 6px 0 26px;
        }

        .mf-remember {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 14px;
          color: #374151;
          font-weight: 600;
          cursor: pointer;
          user-select: none;
        }

        .mf-remember input {
          width: 16px;
          height: 16px;
          accent-color: #16a34a;
          cursor: pointer;
        }

        .mf-forgot {
          font-size: 14px;
          font-weight: 700;
          color: #16a34a;
          text-decoration: none;
          background: none;
          border: none;
          cursor: pointer;
        }

        .mf-forgot:hover { text-decoration: underline; }

        .mf-error {
          background: #fef2f2;
          border: 1px solid #fecaca;
          color: #b91c1c;
          font-size: 13.5px;
          font-weight: 600;
          padding: 10px 14px;
          border-radius: 9px;
          margin-bottom: 18px;
        }

        .mf-submit {
          width: 100%;
          padding: 14px 16px;
          background: #16a34a;
          color: #ffffff;
          font-size: 15px;
          font-weight: 700;
          border: none;
          border-radius: 10px;
          cursor: pointer;
          transition: background 0.15s ease, transform 0.05s ease;
        }

        .mf-submit:hover:not(:disabled) { background: #15803d; }
        .mf-submit:active:not(:disabled) { transform: scale(0.99); }
        .mf-submit:disabled { background: #9ca3af; cursor: not-allowed; }

        .mf-divider {
          display: flex;
          align-items: center;
          gap: 14px;
          margin: 30px 0 22px;
          color: #9ca3af;
          font-size: 11.5px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }

        .mf-divider::before, .mf-divider::after {
          content: "";
          flex: 1;
          height: 1px;
          background: #e5e7eb;
        }

        .mf-help {
          text-align: center;
          font-size: 14px;
          color: #6b7280;
          line-height: 1.6;
        }

        .mf-help b {
          color: #111827;
          font-weight: 700;
        }
      `}</style>

      <div className="mf-form-wrap">
        <div className="mf-eyebrow">
          MICROFINANCE CONTROLS <span className="dim">/ SIGN IN</span>
        </div>
        <h1 className="mf-title">welcome poiuyuttr.</h1>
        <p className="mf-subtitle">
          Enter your credentials to access the loan review and
          verification desk.
        </p>

        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="mf-error">{error}</div>}

          <div className="mf-field">
            <label className="mf-label" htmlFor="username">
              Username
            </label>
            <div className="mf-input-wrap">
              <input
                id="username"
                className="mf-input"
                type="text"
                autoComplete="username"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          </div>

          <div className="mf-field">
            <label className="mf-label" htmlFor="password">
              Password
            </label>
            <div className="mf-input-wrap">
              <input
                id="password"
                className="mf-input"
                type={showPassword ? "text" : "password"}
                autoComplete="current-password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ paddingRight: 56 }}
              />
              <button
                type="button"
                className="mf-toggle"
                onClick={() => setShowPassword((s) => !s)}
              >
                {showPassword ? "HIDE" : "SHOW"}
              </button>
            </div>
          </div>

          <div className="mf-row-between">
            <label className="mf-remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              Remember me
            </label>
            <button type="button" className="mf-forgot">
              Forgot password?
            </button>
          </div>

          <button type="submit" className="mf-submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <div className="mf-divider">Need access</div>
        <p className="mf-help">
          Contact your <b>branch administrator</b> to request a QC
          account.
        </p>
      </div>
    </div>
  );
}
