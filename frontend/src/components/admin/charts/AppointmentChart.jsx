import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

// Register Pie Chart components
ChartJS.register(ArcElement, Tooltip, Legend);

// Define fixed colors for each appointment status
const statusColors = {
  Pending: "#FFD700", // Yellow
  Confirmed: "#87CEEB", // Sky Blue
  Completed: "#28A745", // Green
  Cancelled: "#DC3545", // Red
};

const AppointmentChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/appointment/appointment-stats"
        ); // Adjust API URL if needed
        const data = response.data;

        // Extract labels and values
        const labels = data.map((item) => item._id);
        const values = data.map((item) => item.count);

        // Assign fixed colors based on status
        const colors = labels.map(
          (status) => statusColors[status] || "#CCCCCC"
        );

        setChartData({
          labels,
          datasets: [
            {
              label: "Appointments",
              data: values,
              backgroundColor: colors,
              borderColor: "#ffffff",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: "30%" }}>
      <h2 className="heading">Appointment</h2>
      {chartData ? (
        <Pie data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default AppointmentChart;
