import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";
import "./ElectionResults.css"; // Import CSS

const ElectionResults = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get("http://localhost:8080/api/admin/results")
      .then(response => {
        console.log("Fetched Data:", response.data); // Log the data
        const formattedData = response.data.map(item => ({
          ...item,
          partyName: String(item.partyName), // Ensure it's a string
        }));
        setData(formattedData);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching results:", error);
        setError("Failed to load election results.");
        setLoading(false);
      });
  }, []);
  
  return (
    <div className="election-results-container">
      <h2 className="election-results-title">Election Results</h2>

      {loading && <p className="loading-message">Loading election results...</p>}
      {error && <p className="error-message">{error}</p>}
      {data.length === 0 && !loading && !error && <p>No election results available.</p>}

      {!loading && !error && data.length > 0 && (
        <div className="election-results-chart">
          <ResponsiveContainer width="99%" height={300}> {/* Force re-render */}
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <XAxis 
               dataKey="partyName"
               angle={-20} // Slight rotation for better visibility
  textAnchor="end"
  interval={0} // Ensures all labels are displayed
  tick={{ fontSize: 14 }} // Increase font size for clarity
/>
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Legend />
              <Bar dataKey="voteCount" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
};
export default ElectionResults;
