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
      setReportData(data.monthlyReport);
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
        <tbody>
          {reportData.map((month) =>
            month.services.map((service, index) => (
              <tr key={`${month._id}-${service.service}`}>
                {index === 0 && (
                  <td rowSpan={month.services.length}>{month._id}</td>
                )}
                <td>{service.service}</td>
                <td>{service.bookings}</td>
                <td>₹{service.revenue}</td>
              </tr>
            ))
          )}
          <tr>
            <td colSpan={3}>
              <strong>Total Revenue</strong>
            </td>
            <td>
              <strong>
                ₹
                {reportData.reduce((sum, month) => sum + month.totalRevenue, 0)}
              </strong>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default MonthlySalesReport;
