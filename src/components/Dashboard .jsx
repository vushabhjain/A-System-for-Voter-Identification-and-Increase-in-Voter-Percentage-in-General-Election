import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../redux/authSlice";
import "./Dashboard.css";
import { useEffect, useState } from "react";
import axios from "axios";
import ElectionResults from "./Result";



const Dashboard = () => {
  const token = useSelector((state) => state.auth.token);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [electionStarted, setElectionStarted] = useState(false);
  const [parties, setParties] = useState([]);
  const [message, setMessage] = useState("");
  const [message1, setMessage1] = useState("");
const [showMessage, setShowMessage] = useState(false); // State for message visibility


  useEffect(() => {
    fetchElectionStatus();
    fetchParties();
  }, []);

  const fetchElectionStatus = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/admin/election-status");
      setElectionStarted(response.data.electionStarted);
    } catch (error) {
      console.error("Error fetching election status:", error);
    }
  };

  const fetchParties = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/get-parties");
      console.log("Fetched Parties:", response.data); // ✅ Debugging
      setParties(response.data || []); // ✅ Ensure array, avoid undefined issues
    } catch (error) {
      console.error("Error fetching parties:", error);
    }
  };

  const handleVote = async (partyId) => {
    try {
      const response = await axios.post(`http://localhost:8080/api/vote/${partyId}`, {}, {
        headers: {
          "Authorization": `Bearer ${token.trim()}`, // Trim the token to avoid any spaces
        },
      });
      setMessage1(response.data); // Set the success message
      setShowMessage(true); // Show the message
      setTimeout(() => {
        setShowMessage(false); // Hide the message after 3 seconds
      }, 3000); // 3 seconds
    } catch (error) {
      if (error.response?.status === 400 && error.response?.data === "You have already voted.") {
        setMessage1("You have already voted!"); // Set the message if already voted
        setShowMessage(true); // Show the message
        setTimeout(() => {
          setShowMessage(false); // Hide the message after 3 seconds
        }, 3000); // 3 seconds
      } else {
        setMessage1(error.response?.data || "Error voting.");
        setShowMessage(true);
        setTimeout(() => {
          setShowMessage(false); // Hide the message after 3 seconds
        }, 3000);
      }
    }
  };
  
  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  return (
    <div>
      <nav className="navbar">
        <div className="logo">Voting System</div>
        <div className="search-container">
          <input type="text" className="search-bar" placeholder="Search..." />
          <button className="search-button">🔍</button>
        </div>
        {showMessage && (
  <div className="message-popup">
    {message1}
  </div>
)}

        <div className="user-info">
          {user ? (
            <>
              <span className="user-name">👤 {user.fullName}</span>
              <span className="user-email">📧 {user.emailId}</span>
              <span className="user-phone">📞 {user.phone}</span>
              <span className="user-voterId">🆔 {user.voterId}</span>
            </>
          ) : (
            <span className="user-name">Not Logged In</span>
          )}
          <button className="logout-button" onClick={handleLogout}>Logout</button>
        </div>
      </nav>

      <div className="dashboard-container">
        <aside className="sidebar">
          <ul>
            <li><a href="#">Home</a></li>
            <li><a href="#">Voting Results</a></li>
            <li><a href="#">My Profile</a></li>
            <li><a href="#">Settings</a></li>
          </ul>
        </aside>

        <main className="content">
          <h2>Dashboard (Protected)</h2>
          {token ? (
            <>
              <p>Welcome, <b>{user?.fullName || "User"}</b>! 🎉</p>
              <p>Email: <b>{user?.emailId || "N/A"}</b></p>
              <p>Phone: <b>{user?.phone || "N/A"}</b></p>
              <p>Aadhar ID: <b>{user?.aadharId || "N/A"}</b></p>
              <p>Voter ID: <b>{user?.voterId || "N/A"}</b></p>
            </>
          ) : (
            <p>Please log in.</p>
          )}
        </main>
      </div>
      
      <div>
        <div className="justify-center text-center">
      <h1>User Dashboard</h1>
      <p>Status: {electionStarted ? "🟢 Election Started" : "🔴 Election Ended"}</p>
      </div>
      {electionStarted && (
       <div className="vote-section">
       <h2>Vote for a Party</h2>
       {parties.length > 0 ? (
         <ul>
           {parties.map((party) => (
             <li key={party.id}>
               <img src={`data:image/png;base64,${party.logo}`} alt={party.name} />
               <span>{party.name}</span>
               <button onClick={() => handleVote(party.id)}>Vote</button>
             </li>
           ))}
         </ul>
       ) : (
         <p>No parties available.</p>
       )}
     </div>
      )}

      {message && <p>{message}</p>}
    </div>
    {electionStarted ? (<h3 className="text-success text-centre">Election Is Going On Result Show After Election Ended</h3> ): ( <div className="graph-panel">
         
         <ElectionResults />
       </div>)}
   
   
    </div>
  );
};

export default Dashboard;
