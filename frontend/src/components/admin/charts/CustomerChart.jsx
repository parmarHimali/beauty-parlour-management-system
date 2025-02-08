import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register the necessary Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CustomerChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/users/customer-stats",
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
          }
        );

        setChartData({
          labels: data.labels, // Dynamically received labels (months)
          datasets: [
            {
              label: "Customers Registered",
              data: data.stats, // Dynamically received stats
              backgroundColor: "rgba(46, 144, 144, 0.785)",
              borderColor: "#409f9f",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error(
          "Error fetching customer statistics:",
          error.response?.data || error.message
        );
      }
    };

    fetchStats();
  }, []);

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Months",
        },
      },
      y: {
        title: {
          display: true,
          text: "Customer Count",
        },
        beginAtZero: true,
        ticks: {
          stepSize: 1, // Ensure the y-axis only shows integers
          callback: (value) => (Number.isInteger(value) ? value : null), // Filter non-integer values
        },
      },
    },
  };

  return (
    <div style={{ width: "70%", margin: "0 auto 40px" }}>
      <h3 className="heading">Customer Registration Statistics</h3>
      {chartData ? (
        <Bar data={chartData} options={options} />
      ) : (
        <p>Loading chart data...</p>
      )}
    </div>
  );
};

export default CustomerChart;
