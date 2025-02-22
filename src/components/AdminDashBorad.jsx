import { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AdminDashBorad.css";
import ElectionResults from "./Result";

const AdminDashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const admin = useSelector((state) => state.auth.admin);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [electionStarted, setElectionStarted] = useState(false);
  const [partyName, setPartyName] = useState("");
  const [partyLogo, setPartyLogo] = useState(null);
  const [parties, setParties] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [graphData, setGraphData] = useState([]);

  // ✅ Fetch Election Status
  const fetchElectionStatus = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:8080/api/admin/election-status", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setElectionStarted(response.data.electionStarted);
    } catch (error) {
      console.error("❌ Error fetching election status:", error);
    }
  }, [token]);

  // ✅ Fetch Political Parties
  const fetchParties = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:8080/api/admin/get-parties", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setParties(response.data);
    } catch (error) {
      console.error("❌ Error fetching parties:", error);
    }
  }, [token]);

  // ✅ Fetch Election Results for Graph
  const fetchElectionResults = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get("http://localhost:8080/api/admin/results", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGraphData(response.data);
    } catch (error) {
      console.error("❌ Error fetching election results:", error.response?.data || error.message);
    }
  }, [token]);

  // ✅ Fetch Data on Load
  useEffect(() => {
    if (token) {
      fetchElectionStatus();
      fetchParties();
      fetchElectionResults();
    } else {
      navigate("/login"); // Redirect if no token
    }
  }, [token, fetchElectionStatus, fetchParties, fetchElectionResults, navigate]);

  // ✅ Start Election
  const handleStartElection = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/admin/start-election",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Election Started!");
      setElectionStarted(true);
      fetchElectionStatus();
    } catch (error) {
      alert(error.response?.data || "❌ Error starting election.");
    }
  };

  // ✅ End Election
  const handleEndElection = async () => {
    try {
      await axios.post(
        "http://localhost:8080/api/admin/end-election",
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("❌ Election Ended!");
      setElectionStarted(false);
      fetchElectionStatus();
      fetchElectionResults();
    } catch (error) {
      alert(error.response?.data || "❌ Error ending election.");
    }
  };

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  // ✅ Add Political Party
  const handleAddParty = async () => {
    if (!partyName || !partyLogo) {
      setSuccessMessage("⚠️ Please enter party name and select a logo.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", partyName);
      formData.append("logo", partyLogo);

      const response = await axios.post("http://localhost:8080/api/admin/add-party", formData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });

      setParties([...parties, response.data]);
      setPartyName("");
      setPartyLogo(null);
      setSuccessMessage("✅ Party added successfully!");
    } catch (error) {
      setSuccessMessage("❌ Failed to add party. Please try again.");
    }
  };

  return (
    <div className="admin-dashboard">
      <nav className="admin-navbar">
        <div className="logo">Voting System - Admin</div>
        <div className="admin-info">
          <span>👤 {admin?.name || "Admin"}</span>
          <span>📧 {admin?.email || "admin@example.com"}</span>
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        </div>
      </nav>

      <div className="admin-container">
        {/* Election Control Panel */}
        <div className="election-panel">
          <h2>Election Control Panel</h2>
          <button className="start-button" onClick={handleStartElection} disabled={electionStarted}>
            Start Election
          </button>
          <button className="end-button" onClick={handleEndElection} disabled={!electionStarted}>
            End Election
          </button>
          <p>
            Status: <b>{electionStarted ? "🟢 Election Started" : "🔴 Election Ended"}</b>
          </p>
        </div>

        {/* Add Political Party */}
        <div className="party-panel">
          <h2>Add Political Party</h2>
          <input
            type="text"
            placeholder="Party Name"
            value={partyName}
            onChange={(e) => setPartyName(e.target.value)}
          />
          <input type="file" onChange={(e) => setPartyLogo(e.target.files[0])} />
          <button onClick={handleAddParty}>Add Party</button>
          {successMessage && <p className="success-message">{successMessage}</p>}
        </div>

        {/* Party List */}
        <div className="party-list">
          <h2>Parties Registered</h2>
          {parties.length === 0 ? (
            <p>No parties added yet.</p>
          ) : (
            <ul>
              {parties.map((party, index) => (
                <li key={index}>
                  <img src={`data:image/png;base64,${party.logo}`} alt={party.name} />
                  <span>{party.name}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Election Results Graph */}
        <div className="graph-panel">
         
          <ElectionResults />
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
