import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import './../../lib/Signupstyle.css'


function Signup() {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    setMessage("");

    const formData = {
      full_name: fullName,
      email: email,
      password: password,
      role: role,
    };

    console.log("Submitting form:", formData);

    try {
      const response = await fetch(
        `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Server response:", data);

      if (response.ok) {
        setMessage("User created successfully! Redirecting to login...");
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("customer");
        
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      } else {
        setMessage("Unable to create user: " + (data.message || "Unknown error"));
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Network error, please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-6 col-lg-5">
            <div className="card shadow-lg login-card">
              <div className="card-body p-4 p-md-5">
                <h1 className="text-center mb-2 fw-bold">Create Account</h1>
                <p className="text-center text-muted mb-4">Sign up to get started</p>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label htmlFor="fullName" className="form-label fw-semibold">Full Name</label>
                    <input
                      type="text"
                      className="form-control form-control-lg"
                      id="fullName"
                      placeholder="Enter your full name"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="email" className="form-label fw-semibold">Email</label>
                    <input
                      type="email"
                      className="form-control form-control-lg"
                      id="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label htmlFor="password" className="form-label fw-semibold">Password</label>
                    <input
                      type="password"
                      className="form-control form-control-lg"
                      id="password"
                      placeholder="Enter your password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label className="form-label fw-semibold">Sign up as:</label>
                    <div className="role-selector p-3 rounded">
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="customerRole"
                          value="customer"
                          checked={role === "customer"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        <label className="form-check-label fw-medium" htmlFor="customerRole">
                          Customer (buy services)
                        </label>
                      </div>
                      <div className="form-check form-check-inline">
                        <input
                          className="form-check-input"
                          type="radio"
                          name="role"
                          id="providerRole"
                          value="provider"
                          checked={role === "provider"}
                          onChange={(e) => setRole(e.target.value)}
                        />
                        <label className="form-check-label fw-medium" htmlFor="providerRole">
                          Provider (offer services)
                        </label>
                      </div>
                    </div>
                  </div>

                  {message && (
                    <div className={`alert ${message.includes("successfully") ? "alert-success" : "alert-danger"} d-flex align-items-center`} role="alert">
                      <span className="me-2">{message.includes("successfully") ? "✓" : "⚠️"}</span>
                      <div>{message}</div>
                    </div>
                  )}
                
                  <button 
                    type="submit"
                    className="btn btn-primary btn-lg w-100 mt-3"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Creating Account...
                      </>
                    ) : "Sign Up"}
                  </button>
                </form>

                <div className="text-center mt-3">
                  <p className="text-muted">
                    Already have an account?{" "}
                    <span 
                      className="text-primary" 
                      style={{ cursor: "pointer", textDecoration: "underline" }}
                      onClick={() => navigate("/login")}
                    >
                      Login here
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;