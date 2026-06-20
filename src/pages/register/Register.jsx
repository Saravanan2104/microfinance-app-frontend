import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "../login/Login.css";

const Register = () => {
  const navigate = useNavigate();

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

      const response = await fetch(
        "http://127.0.0.1:8000/api/v1/auth/register",
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
      setSuccessMessage("Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="form-section">
        <div className="login-card">
          <h2>Registration</h2>

          {successMessage && (
            <h4
              style={{
                color: "#22c55e",
                marginBottom: "20px",
                textAlign: "center",
              }}
            >
              {successMessage}
            </h4>
          )}

          <form onSubmit={handleRegister}>
            <div className="input-group">
              <label>Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Date Of Birth</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Aadhar</label>
              <input
                name="aadhar"
                value={formData.aadhar}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>PAN</label>
              <input
                name="pan"
                value={formData.pan}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Phone Number</label>
              <input
                name="phone_no"
                value={formData.phone_no}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Relative Name</label>
              <input
                name="relative_name"
                value={formData.relative_name}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Relative Phone</label>
              <input
                name="relative_phone"
                value={formData.relative_phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Relationship</label>
              <input
                name="relative_relation"
                value={formData.relative_relation}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <label>Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
              >
                <option value="customer">Customer</option>
                <option value="admin">Admin</option>
              </select>
            </div>

            <div className="input-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>

            <div
              style={{
                marginTop: "20px",
                textAlign: "center",
              }}
            >
              <Link to="/">
                Already have an account? Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;