import { useState } from "react";
import { useDispatch } from "react-redux";
import { login } from "../redux/authSlice";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ Import shared CSS

const Login = () => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
    role: "USER", // Default role as User
  });

  const [message, setMessage] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try { 
      const apiUrl = userData.role === "ADMIN" ? "http://localhost:8080/api/admin/login" : "http://localhost:8080/api/auth/login";
      const response = await axios.post(apiUrl, {
        email: userData.email,
        password: userData.password,
      });

      console.log("✅ Login Successful! Response:", response.data);
      const { token, user } = response.data; // Extract token & user details
      dispatch(login({ token, user })); // ✅ Save in Redux

      setMessage("Login successful! Redirecting...");

      setTimeout(() => {
        navigate(userData.role === "ADMIN" ? "/admin-dashboard" : "/dashboard");
      }, 1000);
    } catch (error) {
      console.error("❌ Error logging in:", error.response?.data || "Invalid credentials");

      setMessage(error.response?.data?.message || "Invalid email or password!");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Login</h2>

        {/* ✅ Role Selection Dropdown */}
        <select className="auth-input" name="role" onChange={handleChange}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
        </select>

        <input className="auth-input" type="email" name="email" placeholder="Enter Email" onChange={handleChange} required />
        <input className="auth-input" type="password" name="password" placeholder="Enter Password" onChange={handleChange} required />
        
        <button className="auth-button" onClick={handleLogin}>Login</button>

        <p className="message">{message}</p>

        <p className="switch-auth">
          Don't have an account? <Link to="/" className="auth-link">Register here</Link>
        </p>
        <p className="switch-auth">
          <Link to="/forgetPassword" className="auth-link">Forgot Password?</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
