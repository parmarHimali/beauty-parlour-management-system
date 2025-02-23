import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MonthlyAppointmentsChart = ({ setLoading }) => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          "http://localhost:4000/api/appointment/monthly-chart"
        ); // Adjust URL
        const data = response.data;

        // Generate last 12 months dynamically (Mar 2024 → Feb 2025)
        const months = [];
        const counts = [];
        const now = new Date();

        for (let i = 11; i >= 0; i--) {
          // Reverse loop for oldest to latest
          const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const label = month.toLocaleString("default", {
            month: "short",
            year: "numeric",
          }); // "Mar 2024"

          months.push(label);
          counts.push(0); // Default 0 if no data
        }

        // Assign fetched data to correct month
        data.forEach((item) => {
          const monthIndex = months.findIndex(
            (m) =>
              m ===
              `${new Date(item._id.year, item._id.month - 1).toLocaleString(
                "default",
                { month: "short", year: "numeric" }
              )}`
          );
          if (monthIndex !== -1) {
            counts[monthIndex] = item.count;
          }
        });

        setChartData({
          labels: months, // Oldest → Latest
          datasets: [
            {
              label: "Booked Appointments",
              data: counts,
              borderColor: "#3498db",
              backgroundColor: "rgba(52, 152, 219, 0.5)",
              borderWidth: 2,
              fill: true,
              tension: 0.4, // Smooth curve
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ minWidth: "70%", margin: "10px auto 50px" }}>
      <h2 className="heading">Booked Appointments (Last 12 Months)</h2>
      {chartData ? (
        <Line data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default MonthlyAppointmentsChart;
