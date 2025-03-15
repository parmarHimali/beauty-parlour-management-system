import { useState, useEffect } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import MonthlySalesReport from "./MonthlySalesReport";

const SalesReport = () => {
  const [reportData, setReportData] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const formik = useFormik({
    initialValues: {
      startDate: "",
      endDate: "",
    },
    validationSchema: Yup.object({
      startDate: Yup.date().required("Start date is required"),
      endDate: Yup.date()
        .required("End date is required")
        .min(Yup.ref("startDate"), "End date must be after start date"),
    }),
    onSubmit: fetchSalesData,
  });

  useEffect(() => {
    fetchSalesData();
  }, []);

  async function fetchSalesData() {
    try {
      const response = await axios.get(
        "http://localhost:4000/api/reports/sales",
        {
          params: {
            startDate: formik.values.startDate,
            endDate: formik.values.endDate,
          },
        }
      );
      setReportData(response.data.reportData);
      setTotalRevenue(response.data.totalRevenue);
    } catch (error) {
      console.error("Error fetching sales data", error);
    }
  }

  return (
    <>
      <MonthlySalesReport />
      <div className="report-container" style={{ marginBottom: "40px" }}>
        <h2>Sales Report</h2>
        <form onSubmit={formik.handleSubmit} className="report-dates">
          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="date"
              name="startDate"
              value={formik.values.startDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.startDate && formik.errors.startDate ? (
              <div className="error">{formik.errors.startDate}</div>
            ) : null}
          </div>

          <div style={{ display: "flex", flexDirection: "column" }}>
            <input
              type="date"
              name="endDate"
              value={formik.values.endDate}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
            />
            {formik.touched.endDate && formik.errors.endDate ? (
              <div className="error">{formik.errors.endDate}</div>
            ) : null}
          </div>

          <button type="submit" className="btn-green">
            Filter
          </button>
        </form>

        <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Bookings</th>
              <th>Total Revenue (₹)</th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((service) => (
              <tr key={service.service}>
                <td>{service.service}</td>
                <td>{service.bookings}</td>
                <td>₹{service.revenue}</td>
              </tr>
            ))}
            <tr>
              <td colSpan={2}>Total Revenue</td>
              <td style={{ fontWeight: "bold" }}>₹{totalRevenue}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};

export default SalesReport;
