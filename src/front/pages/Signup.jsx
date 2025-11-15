import React, { useState } from "react";

function Signup() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [message, setMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault(); // stops page reload which was preventing me from actually sending the request/info to the backend

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
        setMessage("User created: " + data.msg);

        // Clear fields after success
        setFullName("");
        setEmail("");
        setPassword("");
        setRole("customer");
      } else {
        setMessage(" Unable to create user: " + data.msg);
      }
    } catch (error) {
      console.error("Network error:", error);
      setMessage("Network error, please try again.");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Sign Up</h2>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Full Name:</label><br />
          <input
            type="text"
            placeholder="Enter your name"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Email:</label><br />
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label>Password:</label><br />
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label>User Type:</label><br />
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          >
            <option value="customer">Customer (buy services)</option>
            <option value="vendor">Vendor (offer services)</option>
          </select>
        </div>

        <button type="submit" style={{ marginTop: "10px" }}>
          Sign Up
        </button>
      </form>

      <p>{message}</p>
    </div>
  );
}

export default Signup;

