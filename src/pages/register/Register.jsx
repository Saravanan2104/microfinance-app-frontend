import { useState } from "react";
import { Link } from "react-router-dom";
import BASE_URL from "../../services/api";

const Register = () => {
  const [successMessage, setSuccessMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    aadhar: "",
    pan: "",
    phone_no: "",
    relative_name: "",
    relative_phone: "",
    relative_relation: "",
    role: "customer",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      setSuccessMessage("");

      const response = await fetch(
        `${BASE_URL}/api/v1/auth/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Registration Successful. Please Login."
        );

        setFormData({
          name: "",
          dob: "",
          aadhar: "",
          pan: "",
          phone_no: "",
          relative_name: "",
          relative_phone: "",
          relative_relation: "",
          role: "customer",
          password: "",
        });
      } else {
        setSuccessMessage(
          data.detail || "Registration Failed"
        );
      }
    } catch (error) {
      console.error(error);
      setSuccessMessage(
        "Unable to connect to server"
      );
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

        {/* LEFT SIDE - REGISTRATION FORM */}

        <div className="col-lg-6 d-flex align-items-center justify-content-center py-5">

          <div
            className="card text-white border-0"
            style={{
              width: "550px",
              background: "rgba(255,255,255,0.05)",
              backdropFilter: "blur(25px)",
              WebkitBackdropFilter: "blur(25px)",
              boxShadow:
                "0 10px 30px rgba(0,0,0,0.3)",
              border:
                "1px solid rgba(34,197,94,0.2)",
            }}
          >
            <div className="card-body p-4">

              <h2
                className="text-center mb-4"
                style={{
                  color: "#22c55e",
                }}
              >
                Registration
              </h2>

              {successMessage && (
                <h4
                  className="text-center mb-4"
                  style={{
                    color: "#22c55e",
                  }}
                >
                  {successMessage}
                </h4>
              )}

              <form onSubmit={handleRegister}>

                <div className="mb-3">
                  <label className="form-label">
                    Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Date Of Birth
                  </label>

                  <input
                    type="date"
                    className="form-control"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Aadhar Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="aadhar"
                    value={formData.aadhar}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    PAN Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="pan"
                    value={formData.pan}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Phone Number
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="phone_no"
                    value={formData.phone_no}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Relative Name
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="relative_name"
                    value={formData.relative_name}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Relative Phone
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="relative_phone"
                    value={formData.relative_phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Relationship
                  </label>

                  <input
                    type="text"
                    className="form-control"
                    name="relative_relation"
                    value={formData.relative_relation}
                    onChange={handleChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Password
                  </label>

                  <input
                    type="password"
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn w-100 fw-bold"
                  style={{
                    background: "#22c55e",
                    color: "#000",
                    border: "none",
                  }}
                >
                  {loading
                    ? "Registering..."
                    : "Register"}
                </button>

                <div className="text-center mt-3">
                  <Link
                    to="/"
                    className="text-success text-decoration-none"
                  >
                    Already have an account? Login
                  </Link>
                </div>

              </form>

            </div>
          </div>

        </div>

        {/* RIGHT SIDE - BRANDING */}

        <div className="col-lg-6 d-flex align-items-center justify-content-center">

          <div className="text-white p-5">

            <h1
              className="display-3 fw-bold"
              style={{
                color: "#22c55e",
              }}
            >
              Loan Management
            </h1>

            <p className="lead mt-4">
              Manage customers, loans, collections and
              analytics from a centralized platform.
            </p>

            <div className="mt-5">

              <div
                className="ps-3 py-3 mb-3 rounded"
                style={{
                  borderLeft:
                    "4px solid #22c55e",
                  background:
                    "rgba(255,255,255,0.03)",
                }}
              >
                Customer Management
              </div>

              <div
                className="ps-3 py-3 mb-3 rounded"
                style={{
                  borderLeft:
                    "4px solid #22c55e",
                  background:
                    "rgba(255,255,255,0.03)",
                }}
              >
                Loan Tracking
              </div>

              <div
                className="ps-3 py-3 rounded"
                style={{
                  borderLeft:
                    "4px solid #22c55e",
                  background:
                    "rgba(255,255,255,0.03)",
                }}
              >
                Real-time Reports
              </div>

            </div>

          </div>

        </div>

      </div>
    </div>
  );
};

export default Register;