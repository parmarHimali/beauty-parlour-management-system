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

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const CurrMonthAppChart = () => {
  const [chartData, setChartData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/appointment/currMonth-chart"
        );
        const data = response.data;
        console.log(data);

        // Extract labels (dates) and values (appointments count)
        const labels = data.map((item) => item._id); // Dates
        const values = data.map((item) => item.count); // Bookings count

        setChartData({
          labels,
          datasets: [
            {
              label: "Appointments Per Day",
              data: values,
              backgroundColor: "rgba(46, 144, 144, 0.785)", // Sky blue color
              borderColor: "rgba(46, 144, 144, 0.537)",
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
    <div style={{ width: "40%", margin: "0 auto" }}>
      <h2 className="heading">Appointments This Month</h2>
      {chartData ? (
        <Bar data={chartData} options={{ responsive: true }} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CurrMonthAppChart;
