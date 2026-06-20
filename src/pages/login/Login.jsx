import { useState } from "react";
import { useNavigate } from "react-router-dom";
import BASE_URL from "../../services/api";

const Login = () => {
  const navigate = useNavigate();

  const [memberCode, setMemberCode] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setErrorMessage("");

      const response = await fetch(
        `${BASE_URL}/auth/member-login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            member_code: memberCode,
            password: password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem(
          "access_token",
          data.access_token
        );

        navigate("/home");
      } else {
        setErrorMessage(
          data.detail || "Invalid Credentials"
        );
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="container-fluid min-vh-100"
      style={{
        background:
          "linear-gradient(135deg, #000000, #06120a, #000000)",
      }}
    >
      <div className="row min-vh-100">

        {/* Left Section */}

        <div className="col-lg-6 d-flex align-items-center justify-content-center">
          <div className="text-white p-5">

            <h1
              className="display-3 fw-bold"
              style={{
                color: "#39FF14",
                textShadow:
                  "0 0 10px #1ec002, 0 0 10px #979797, 0 0 10px #bebebe",
              }}
            >
              Loan Management
            </h1>

            <p className="lead mt-4 text-light">
              Manage customers, loans, collections and
              analytics from a centralized platform.
            </p>

            <div className="mt-5">

              <div
                className="ps-3 py-3 mb-3 rounded"
                style={{
                  borderLeft: "4px solid #39FF14",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Customer Management
              </div>

              <div
                className="ps-3 py-3 mb-3 rounded"
                style={{
                  borderLeft: "4px solid #39FF14",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Loan Tracking
              </div>

              <div
                className="ps-3 py-3 rounded"
                style={{
                  borderLeft: "4px solid #39FF14",
                  background: "rgba(255,255,255,0.03)",
                }}
              >
                Real-time Reports
              </div>

            </div>

          </div>
        </div>

        {/* Right Section */}

        <div className="col-lg-6 d-flex align-items-center justify-content-center">

          <div
            className="card text-white border-0"
            style={{
              width: "450px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              boxShadow:
                "0 0 30px rgba(57,255,20,0.25)",
              border:
                "1px solid rgba(57,255,20,0.2)",
            }}
          >
            <div className="card-body p-5">

              <h2
                className="text-center mb-2"
                style={{
                  color: "#39FF14",
                }}
              >
                Member Login
              </h2>

              <p className="text-center text-secondary mb-4">
                Sign in to continue
              </p>

              {errorMessage && (
                <div className="alert alert-danger">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleLogin}>

                <div className="mb-3">
                  <label className="form-label">
                    Member Code
                  </label>

                  <input
                    type="text"
                    className="form-control bg-dark text-white border-success"
                    placeholder="MBR000001"
                    value={memberCode}
                    onChange={(e) =>
                      setMemberCode(e.target.value)
                    }
                  />
                </div>

                <div className="mb-4">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control bg-dark text-white border-success"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) =>
                      setPassword(e.target.value)
                    }
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 fw-bold"
                  style={{
                    background: "#39FF14",
                    color: "#000",
                    border: "none",
                    padding: "12px",
                  }}
                >
                  {loading
                    ? "Signing In..."
                    : "Login"}
                </button>

              </form>

            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default Login;