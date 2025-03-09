import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import "chart.js/auto";

const ServiceChart = () => {
  const [serviceData, setServiceData] = useState([]);

  useEffect(() => {
    const fetchServiceData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/services/most-req"
        );
        console.log("Fetched Data:", response.data); // Debugging line
        setServiceData(
          Array.isArray(response.data.formattedData)
            ? response.data.formattedData
            : []
        );
      } catch (error) {
        console.error("Error fetching service data:", error);
        setServiceData([]);
      }
    };

    fetchServiceData();
  }, []);

  return (
    <div>
      <h3 className="heading">Appointments booked for different services</h3>
      <div style={{ width: "50%", margin: "auto" }}>
        <Bar
          data={{
            labels: serviceData?.map((service) => service.name),
            datasets: [
              {
                label: "Number of Appointments",
                data: serviceData?.map((service) => service.count),
                backgroundColor: "rgba(54, 162, 235, 0.6)",
              },
            ],
          }}
          options={{
            indexAxis: "y",
            responsive: true,
            plugins: {
              legend: { display: false },
            },
            scales: {
              x: {
                beginAtZero: true, // Ensures X-axis starts from 0
                ticks: {
                  stepSize: 1, // Ensure whole numbers (if needed)
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
};

export default ServiceChart;
