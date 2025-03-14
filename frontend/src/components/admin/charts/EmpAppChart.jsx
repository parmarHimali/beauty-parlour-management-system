import React, { useEffect, useState } from "react";
import axios from "axios";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

const EmpAppChart = () => {
  const [barChartData, setBarChartData] = useState(null);
  const [pieChartData, setPieChartData] = useState(null);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/appointment/emp-chart"
        );

        const labels = data.appointmentData.map((emp) => emp.name);
        const appointmentCounts = data.appointmentData.map(
          (emp) => emp.totalAppointments
        );

        setBarChartData({
          labels,
          datasets: [
            {
              label: "Total Appointments",
              data: appointmentCounts,
              backgroundColor: "rgba(46, 144, 144, 0.785)",
              borderColor: "rgba(75, 192, 192, 1)",
              borderWidth: 1,
            },
          ],
        });
      } catch (error) {
        console.error("Error fetching appointment data:", error);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <div className="chart-100">
      <h2 className="heading">Appointments Per Employee</h2>
      {barChartData ? (
        <Bar
          data={barChartData}
          style={{ paddingBottom: "20px", height: "70vh" }}
        />
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default EmpAppChart;
