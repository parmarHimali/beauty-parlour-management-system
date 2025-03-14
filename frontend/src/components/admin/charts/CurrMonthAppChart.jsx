import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import axios from "axios";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

const CurrMonthAppChart = () => {
  const [chartData, setChartData] = useState(null);
  const [chartOptions, setChartOptions] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/appointment/currMonth-chart"
        );
        const data = response.data;

        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();
        const lastDay = new Date(year, month + 1, 0).getDate();

        const allDates = Array.from({ length: lastDay }, (_, i) => {
          const day = i + 1;
          return `${year}-${String(month + 1).padStart(2, "0")}-${String(
            day
          ).padStart(2, "0")}`;
        });

        const appointmentMap = data.reduce((acc, item) => {
          acc[item._id] = item.count;
          return acc;
        }, {});

        const values = allDates.map((date) => appointmentMap[date] || 0);
        const maxCount = Math.max(...values);
        const extraSpace = maxCount <= 3 ? 4 : Math.ceil(maxCount * 0.2);
        const suggestedMax = Math.max(maxCount + extraSpace, 5);

        setChartData({
          labels: allDates,
          datasets: [
            {
              label: "Appointments Per Day",
              data: values,
              borderColor: "rgba(46, 144, 144, 0.9)",
              backgroundColor: "rgba(46, 144, 144, 0.3)",
              borderWidth: 2,
              pointBackgroundColor: "rgba(46, 144, 144, 1)",
              pointRadius: 4,
              tension: 0.3,
            },
          ],
        });

        setChartOptions({
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
              ticks: {
                stepSize: 1,
                suggestedMax: suggestedMax,
              },
            },
          },
        });
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="chart-70">
      <h2 className="heading">Appointments This Month</h2>
      {chartData ? (
        <Line data={chartData} options={chartOptions} />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default CurrMonthAppChart;
