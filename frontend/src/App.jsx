import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";

import { UserContext } from "./context/userContext.jsx";
import "./admin.css";
import "./index.css";

import Home from "./components/home/Home";
import Categories from "./components/users/services/Categories";
import Review from "./components/users/Review";
import BookAppointment from "./components/users/BookAppointment";
import Services from "./components/users/services/Services";
import ServiceDetail from "./components/users/services/ServiceDetail";
import Register from "./components/auth/Register";
import Footer from "./components/layout/Footer";
import UserNavbar from "./components/layout/UserNavbar";
import ScrollToTop from "./components/ScrollToTop";
import Dashboard from "./components/admin/Dashboard.jsx";
import Header from "./components/admin/Header.jsx";
import Sidebar from "./components/admin/Sidebar.jsx";
import ServiceList from "./components/admin/ServiceList.jsx";
import EditService from "./components/admin/EditService.jsx";
import AddService from "./components/admin/AddService.jsx";
import AddCategory from "./components/admin/AddCategory.jsx";
import CategoryList from "./components/admin/CategoryList.jsx";
import EditCategory from "./components/admin/EditCategory.jsx";
import CustomerList from "./components/admin/CustomerList.jsx";
import EmployeeList from "./components/admin/EmployeeList.jsx";
import RegisterEmployee from "./components/admin/RegisterEmployee.jsx";
import AllAppointments from "./components/admin/AllAppointments.jsx";
import TodayAppointments from "./components/admin/TodayAppointments.jsx";
import EmpNavbar from "./components/employees/EmpNavbar.jsx";
import About from "./components/home/About.jsx";
import EmpDashboard from "./components/employees/EmpDashboard.jsx";
import Profile from "./components/employees/Profile.jsx";
import EmpHeader from "./components/employees/EmpHeader.jsx";
import AppointmentDetails from "./components/admin/AppointmentDetails.jsx";
import BookedDetails from "./components/users/BookedDetails.jsx";
import EmpAppointmentDetails from "./components/employees/EmpAppointmentDetails.jsx";
import EmailVerify from "./components/auth/EmailVerify.jsx";
import AllService from "./components/employees/AllService.jsx";
import EmpServiceDetail from "./components/employees/EmpServiceDetail.jsx";
import Loading from "./components/Loading.jsx";

const App = () => {
  const { isAuthorized, setIsAuthorized, setUser, user } =
    useContext(UserContext);
  const [loading, setLoading] = useState(false);
  // console.log(user);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/users/getUser",
          { withCredentials: true }
        );
        setUser(data.user);
        setIsAuthorized(true);
      } catch (error) {
        setUser(null);
        setIsAuthorized(false);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [isAuthorized]);

  if (loading) {
    return <Loading />;
  }

  const renderRoutes = () => {
    if (!isAuthorized) {
      return (
        <>
          <UserNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/services/:cid" element={<Services />} />
            <Route path="/s-detail/:sid" element={<ServiceDetail />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verifyEmail" element={<EmailVerify />} />
            <Route path="/about" element={<About />} />
          </Routes>
          <Footer />
        </>
      );
    }

    if (user?.role === "User") {
      return (
        <>
          <UserNavbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/review" element={<Review />} />
            <Route path="/book-appointment" element={<BookAppointment />} />
            <Route path="/booked" element={<BookedDetails />} />
            <Route path="/services/:cid" element={<Services />} />
            <Route path="/about" element={<About />} />
            {/* <Route path="/cart/:sid" element={<CartForm />} /> */}
            <Route path="/s-detail/:sid" element={<ServiceDetail />} />
            <Route path="/appointment/:aid" element={<AppointmentDetails />} />
          </Routes>
          <Footer />
        </>
      );
    }
    // console.log(user);

    if (user?.role === "Admin") {
      return (
        <div className="dashboard-container">
          <Sidebar />
          <div className="main-content">
            <Header />
            <Routes>
              <Route path="/admin/dashboard" element={<Dashboard />} />
              <Route path="/admin/service-list" element={<ServiceList />} />
              <Route path="/admin/category-list" element={<CategoryList />} />
              <Route path="/admin/customer-list" element={<CustomerList />} />
              <Route path="/admin/employee-list" element={<EmployeeList />} />
              <Route path="/admin/all-app" element={<AllAppointments />} />
              <Route path="/admin/today-app" element={<TodayAppointments />} />
              <Route
                path="/admin/add-employee"
                element={<RegisterEmployee />}
              />
              <Route
                path="/admin/appointment/:aid"
                element={<AppointmentDetails />}
              />
              <Route
                path="/admin/service-edit/:sid"
                element={<EditService />}
              />
              <Route
                path="/admin/category-edit/:cid"
                element={<EditCategory />}
              />
              <Route path="/admin/add-service" element={<AddService />} />
              <Route path="/admin/add-category" element={<AddCategory />} />
              <Route path="/admin/see-more/:sid" element={<ServiceDetail />} />
            </Routes>
          </div>
        </div>
      );
    }
    if (user?.role === "Employee") {
      return (
        <>
          <div className="dashboard-container">
            <EmpNavbar />
            <div className="main-content">
              <EmpHeader />
              <Routes>
                <Route path="/emp" element={<EmpDashboard />} />
                <Route path="/profile" element={<Profile />} />
                <Route path="/emp/all-services" element={<AllService />} />
                <Route
                  path="emp/services/:sid"
                  element={<EmpServiceDetail />}
                />
                <Route
                  path="/emp/appointment/:aid"
                  element={<EmpAppointmentDetails />}
                />
              </Routes>
            </div>
          </div>
        </>
      );
    }
  };
  return (
    <Router>
      <ScrollToTop />
      {renderRoutes()}
      <Toaster />
    </Router>
  );
};

export default App;
