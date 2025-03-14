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
  console.log(chartData);

  return (
    <div className="dashboard">
      {/* Line Chart - Appointments Over Time */}

      <h4>Appointments Over Time</h4>
      <Line
        className="chart-100"
        data={{
          labels: Object.keys(chartData.appointmentsByDate),
          datasets: [
            {
              label: "Number of Appointments",
              data: appointmentCounts,
              borderColor: "#287171",
              backgroundColor: "#378989de",
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

      <div className="d-flex gap-2" style={{ height: "50vh" }}>
        {/* Pie Chart - Most Requested Services */}
        <div className="chart-half" style={{ paddingBottom: "50px" }}>
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
        <div className="chart-half" style={{ paddingBottom: "50px" }}>
          <h4 className="heading">Appointment Status Breakdown</h4>
          <Pie
            data={{
              labels: ["Pending", "Confirmed", "Completed", "Cancelled"], // Keep labels in the intended order
              datasets: [
                {
                  data: [
                    chartData.statusCount.Pending,
                    chartData.statusCount.Confirmed,
                    chartData.statusCount.Completed,
                    chartData.statusCount.Cancelled,
                  ],
                  backgroundColor: ["#ffc107", "#17a2b8", "#28a745", "#dc3545"],
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
