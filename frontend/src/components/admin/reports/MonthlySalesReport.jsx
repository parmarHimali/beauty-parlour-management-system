import { useState, useEffect } from "react";
import axios from "axios";

const MonthlySalesReport = () => {
  const [reportData, setReportData] = useState([]);

  useEffect(() => {
    fetchMonthlySales();
  }, []);

  const fetchMonthlySales = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/reports/monthly-sales"
      );
      setReportData(data.monthlyReport); // Store all months' data
    } catch (error) {
      console.error("Error fetching monthly sales data", error);
    }
  };

  return (
    <div className="report-container">
      <h2>Monthly Revenue Report</h2>
      <table>
        <thead>
          <tr>
            <th>Month</th>
            <th>Service</th>
            <th>Bookings</th>
            <th>Revenue (₹)</th>
          </tr>
        </thead>

        {reportData.length > 0 ? (
          [...reportData].reverse().map((monthData, idx) => (
            <tbody key={idx}>
              {monthData?.services.map((service, index) => (
                <tr key={`${index}-${Math.floor(Math.random() * 9876)}`}>
                  {index === 0 && (
                    <td rowSpan={monthData.services.length}>{monthData._id}</td>
                  )}
                  <td>{service.service}</td>
                  <td>{service.bookings}</td>
                  <td>₹{service.revenue}</td>
                </tr>
              ))}
              <tr
                style={{
                  border: "2px solid #3c3c3c",
                }}
              >
                <td colSpan={2}>
                  <strong>Total Revenue</strong>
                </td>
                <td>{monthData.totalBookings}</td>
                <td style={{ backgroundColor: "#195b5b", color: "white" }}>
                  <strong>₹{monthData.totalRevenue}</strong>
                </td>
              </tr>
            </tbody>
          ))
        ) : (
          <tbody>
            <tr>
              <td colSpan="4">No data available</td>
            </tr>
          </tbody>
        )}
      </table>
    </div>
  );
};

export default MonthlySalesReport;
