import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import "./Auth.css";

const Register = () => {
  const [userData, setUserData] = useState({
    fullName: "",
    emailId: "",
    password: "",
    phone: "",
    aadharId: "",
  });

  const [errors, setErrors] = useState({});
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    let newErrors = {};
    
    if (!userData.fullName.trim() || userData.fullName.length < 3) {
      newErrors.fullName = "Full Name must be at least 3 characters";
    }

    if (!userData.emailId.trim() || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(userData.emailId)) {
      newErrors.emailId = "Invalid email format";
    }

    if (!userData.password || userData.password.length < 6 || !/\d/.test(userData.password)) {
      newErrors.password = "Password must be at least 6 characters & include a number";
    }

    if (!userData.phone || !/^\d{10}$/.test(userData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    if (!userData.aadharId || !/^\d{12}$/.test(userData.aadharId)) {
      newErrors.aadharId = "Aadhar ID must be 12 digits";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRequestOtp = async () => {
    if (!validate()) return;
    
    try {
      await axios.post("http://localhost:8080/api/auth/request-otp", null, {
        params: { email: userData.emailId },
      });
      setOtpSent(true);
      setMessage("OTP sent successfully!");
    } catch (error) {
      setMessage("Failed to send OTP");
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      setMessage("Please enter OTP");
      return;
    }

    try {
      await axios.post("http://localhost:8080/api/auth/verify-otp", null, {
        params: { email: userData.emailId, otp },
      });

      await axios.post("http://localhost:8080/api/registerusers", userData);
      setMessage("Registration successful!");
      navigate("/login");
    } catch (error) {
      setMessage("Invalid OTP");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Register</h2>
        
        <input type="text" name="fullName" placeholder="Full Name" onChange={handleChange} required />
        {errors.fullName && <p className="error">{errors.fullName}</p>}

        <input type="email" name="emailId" placeholder="Email" onChange={handleChange} required />
        {errors.emailId && <p className="error">{errors.emailId}</p>}

        <input type="password" name="password" placeholder="Password" onChange={handleChange} required />
        {errors.password && <p className="error">{errors.password}</p>}

        <input type="text" name="phone" placeholder="Phone" onChange={handleChange} required />
        {errors.phone && <p className="error">{errors.phone}</p>}

        <input type="text" name="aadharId" placeholder="Aadhar ID" onChange={handleChange} required />
        {errors.aadharId && <p className="error">{errors.aadharId}</p>}

        <button onClick={handleRequestOtp} disabled={otpSent}>Request OTP</button>

        {otpSent && (
          <div className="otp-section">
            <input type="text" placeholder="Enter OTP" onChange={(e) => setOtp(e.target.value)} required />
            <button onClick={handleVerifyOtp}>Verify OTP & Register</button>
          </div>
        )}

        <p className="message">{message}</p>

        <p className="switch-auth">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
