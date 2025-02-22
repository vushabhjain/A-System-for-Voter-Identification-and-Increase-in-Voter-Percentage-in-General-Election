import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Auth.css"; // ✅ Import shared CSS file

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [step, setStep] = useState(1);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // ✅ Request OTP
  const handleRequestOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/forgot-password", null, {
        params: { email },
      });
      setMessage(response.data);
      setStep(2);
    } catch (error) {
      setMessage(error.response?.data || "Failed to send OTP.");
    }
  };

  // ✅ Verify OTP
  const handleVerifyOtp = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/verify-forgot-password", null, {
        params: { email, otp },
      });
      setMessage(response.data);
      setStep(3);
    } catch (error) {
      setMessage(error.response?.data || "Invalid OTP.");
    }
  };

  // ✅ Reset Password
  const handleResetPassword = async () => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/reset-password", null, {
        params: { email, newPassword },
      });
      setMessage(response.data);
      setTimeout(() => navigate("/login"), 2000); // Redirect to login after success
    } catch (error) {
      setMessage(error.response?.data || "Failed to reset password.");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Forgot Password</h2>

        {step === 1 && (
          <>
            <input type="email" placeholder="Enter Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <button onClick={handleRequestOtp}>Request OTP</button>
          </>
        )}

        {step === 2 && (
          <>
            <input type="text" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
            <button onClick={handleVerifyOtp}>Verify OTP</button>
          </>
        )}

        {step === 3 && (
          <>
            <input type="password" placeholder="Enter New Password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
            <button onClick={handleResetPassword}>Reset Password</button>
          </>
        )}

        <p className="message">{message}</p>

        <p className="switch-auth">
          Remember your password? <a href="/login">Login</a>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
