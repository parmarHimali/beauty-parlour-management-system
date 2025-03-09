import React, { useContext, useEffect, useState } from "react";
import { Line, Pie } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";
import { UserContext } from "../../../context/UserContext";

const EmployeeCharts = () => {
  const [chartData, setChartData] = useState({
    appointmentsByDate: {},
    servicesCount: {},
    statusCount: {},
  });

  const { user } = useContext(UserContext);

  const getAllDatesOfMonth = () => {
    const dates = {};
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth();

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = new Date(year, month, day).toISOString().split("T")[0];
      dates[dateString] = 0;
    }
    return dates;
  };

  useEffect(() => {
    const fetchChartData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/employee/charts/${user._id}`
        );

        let appointmentsByDate = getAllDatesOfMonth();

        for (const [date, count] of Object.entries(
          response.data.appointmentsByDate
        )) {
          if (appointmentsByDate[date] !== undefined) {
            appointmentsByDate[date] = count;
          }
        }

        setChartData({
          ...response.data,
          appointmentsByDate,
        });
      } catch (error) {
        console.error("Error fetching chart data:", error);
      }
    };

    if (user._id) {
      fetchChartData();
    }
  }, [user._id]);

  const appointmentCounts = Object.values(chartData.appointmentsByDate);
  const maxValue = Math.max(...appointmentCounts, 1);
  const suggestedMax =
    maxValue <= 5 ? maxValue + 3 : maxValue + Math.ceil(maxValue * 0.2);
  const suggestedMin = 0;

  return (
    <div>
      {/* Line Chart - Appointments Over Time */}
      <div style={{ width: "80%", margin: "auto" }}>
        <h4>Appointments Over Time</h4>
        <Line
          data={{
            labels: Object.keys(chartData.appointmentsByDate),
            datasets: [
              {
                label: "Number of Appointments",
                data: appointmentCounts,
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                tension: 0.4,
              },
            ],
          }}
          options={{
            responsive: true,
            scales: {
              y: {
                ticks: {
                  stepSize: 1, // Ensure only whole numbers
                  callback: (value) => (Number.isInteger(value) ? value : null),
                },
                suggestedMin,
                suggestedMax,
              },
            },
          }}
        />
      </div>

      {/* Pie Chart - Most Requested Services */}
      <div className="emp-pie-chart">
        <div style={{ width: "30%" }}>
          <h4 className="heading">Most Requested Services</h4>
          <Pie
            data={{
              labels: Object.keys(chartData.servicesCount),
              datasets: [
                {
                  data: Object.values(chartData.servicesCount),
                  backgroundColor: ["#ff6384", "#36a2eb", "#ffce56", "#4bc0c0"],
                },
              ],
            }}
          />
        </div>

        {/* Pie Chart - Appointment Status Breakdown */}
        <div style={{ width: "30%" }}>
          <h4 className="heading">Appointment Status Breakdown</h4>
          <Pie
            data={{
              labels: ["Pending", "Confirmed", "Completed", "Cancelled"],
              datasets: [
                {
                  data: Object.values(chartData.statusCount),
                  backgroundColor: ["#ffc107", "#28a745", "#17a2b8", "#dc3545"],
                },
              ],
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default EmployeeCharts;
