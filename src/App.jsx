import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import Login from "./Components/login.jsx";
import Dashboard from "./Components/Dashboard .jsx";
import Register from "./components/Register.jsx";
import ForgotPassword from "./components/ForgotPassword.jsx";
import AdminDashboard from "./components/AdminDashBorad.jsx";


const App = () => {
  const token = useSelector((state) => state.auth.token);

  return (
    
      <Routes>
        <Route path="/" element={<Register/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={token ? <Dashboard /> : <Navigate to="/login" />} />
        <Route path="/forgetPassword" element={<ForgotPassword/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="*" element={<Navigate to={token ? "/dashboard" : "/login"} />} />
      </Routes>
     );
};

export default App;
