import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
} from "react-router-dom";
import { useContext, useEffect, useState, lazy, Suspense } from "react";
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { UserContext } from "./context/userContext.jsx";
import "./employee.css";
import "./admin.css";
import "./index.css";

import UserNavbar from "./components/layout/UserNavbar";
import Sidebar from "./components/admin/Sidebar.jsx";
import EmpNavbar from "./components/employees/EmpNavbar.jsx";
import Footer from "./components/layout/Footer.jsx";
import EmpHeader from "./components/employees/EmpHeader.jsx";
import Header from "./components/admin/Header.jsx";
import ScrollToTop from "./components/ScrollToTop";
import Loading from "./components/Loading.jsx";
import NotFound from "./components/NotFound.jsx";
import UserOutlet from "./components/outlets/UserOutlet.jsx";
import AdminOutlet from "./components/outlets/AdminOutlet.jsx";
import EmployeeOutlet from "./components/outlets/EmployeeOutlet.jsx";

const Home = lazy(() => import("./components/home/Home"));
const Categories = lazy(() => import("./components/users/services/Categories"));
const Review = lazy(() => import("./components/users/Review"));
const BookAppointment = lazy(() =>
  import("./components/users/BookAppointment")
);
const Services = lazy(() => import("./components/users/services/Services"));
const ServiceDetail = lazy(() =>
  import("./components/users/services/ServiceDetail")
);
const Register = lazy(() => import("./components/auth/Register"));
const Dashboard = lazy(() => import("./components/admin/Dashboard.jsx"));
const ServiceList = lazy(() => import("./components/admin/ServiceList.jsx"));
const EditService = lazy(() => import("./components/admin/EditService.jsx"));
const AddService = lazy(() => import("./components/admin/AddService.jsx"));
const AddCategory = lazy(() => import("./components/admin/AddCategory.jsx"));
const CategoryList = lazy(() => import("./components/admin/CategoryList.jsx"));
const EditCategory = lazy(() => import("./components/admin/EditCategory.jsx"));
const CustomerList = lazy(() => import("./components/admin/CustomerList.jsx"));
const EmployeeList = lazy(() => import("./components/admin/EmployeeList.jsx"));
const RegisterEmployee = lazy(() =>
  import("./components/admin/RegisterEmployee.jsx")
);
const AllAppointments = lazy(() =>
  import("./components/admin/AllAppointments.jsx")
);
const TodayAppointments = lazy(() =>
  import("./components/admin/TodayAppointments.jsx")
);
const About = lazy(() => import("./components/home/About.jsx"));
const EmpDashboard = lazy(() =>
  import("./components/employees/EmpDashboard.jsx")
);
const Profile = lazy(() => import("./components/employees/Profile.jsx"));
const AppointmentDetails = lazy(() =>
  import("./components/admin/AppointmentDetails.jsx")
);
const BookedDetails = lazy(() =>
  import("./components/users/BookedDetails.jsx")
);
const EmpAppointmentDetails = lazy(() =>
  import("./components/employees/EmpAppointmentDetails.jsx")
);
const EmailVerify = lazy(() => import("./components/auth/EmailVerify.jsx"));
const AllService = lazy(() => import("./components/employees/AllService.jsx"));
const EmpServiceDetail = lazy(() =>
  import("./components/employees/EmpServiceDetail.jsx")
);
const SalesReport = lazy(() =>
  import("./components/admin/reports/SalesReport.jsx")
);
const EmpHome = lazy(() => import("./components/employees/EmpHome.jsx"));
const AllEmpAppointments = lazy(() =>
  import("./components/employees/AllEmpAppointments.jsx")
);
const ResetPassword = lazy(() => import("./components/auth/ResetPassword.jsx"));

export const BASE_URL = "http://localhost:4000/api";
export const IMG_URL = "http://localhost:4000";
export const convertTo12HourFormat = (time24) => {
  const [hours, minutes] = time24.split(":");
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? "PM" : "AM";
  const formattedHour = hour % 12 || 12; // Convert 0 to 12
  return `${formattedHour}:${minutes} ${ampm}`;
};
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
          {/* <UserNavbar /> */}
          <Suspense fallback={<Loading />}>
            <Routes>
              <Route path="/" element={<UserOutlet />}>
                <Route path="/" element={<Home />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/services/:cid" element={<Services />} />
                <Route path="/s-detail/:sid" element={<ServiceDetail />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verifyEmail" element={<EmailVerify />} />
                <Route path="/about" element={<About />} />
                <Route
                  path="/reset-password/:token"
                  element={<ResetPassword />}
                />
              </Route>
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          {/* <Footer /> */}
        </>
      );
    }

    if (user?.role === "User") {
      return (
        <>
          <Routes>
            <Route path="/" element={<UserOutlet />}>
              <Route path="/" element={<Home />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/review" element={<Review />} />
              <Route path="/book-appointment" element={<BookAppointment />} />
              <Route path="/booked" element={<BookedDetails />} />
              <Route path="/services/:cid" element={<Services />} />
              <Route path="/about" element={<About />} />
              <Route path="/s-detail/:sid" element={<ServiceDetail />} />
              <Route
                path="/appointment/:aid"
                element={<AppointmentDetails />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      );
    }

    if (user?.role === "Admin") {
      return (
        <Routes>
          <Route path="/" element={<AdminOutlet />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/admin/service-list" element={<ServiceList />} />
            <Route path="/admin/category-list" element={<CategoryList />} />
            <Route path="/admin/customer-list" element={<CustomerList />} />
            <Route path="/admin/employee-list" element={<EmployeeList />} />
            <Route path="/admin/all-app" element={<AllAppointments />} />
            <Route path="/admin/today-app" element={<TodayAppointments />} />
            <Route path="/admin/add-employee" element={<RegisterEmployee />} />
            <Route path="/sales-report" element={<SalesReport />} />
            <Route
              path="/admin/appointment/:aid"
              element={<AppointmentDetails />}
            />
            <Route path="/admin/service-edit/:sid" element={<EditService />} />
            <Route
              path="/admin/category-edit/:cid"
              element={<EditCategory />}
            />
            <Route path="/admin/add-service" element={<AddService />} />
            <Route path="/emp-profile/:eid" element={<Profile />} />
            <Route path="/admin/add-category" element={<AddCategory />} />
            <Route path="/admin/add-app" element={<BookAppointment />} />
            <Route path="/admin/see-more/:sid" element={<ServiceDetail />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
    if (user?.role === "Employee") {
      return (
        <>
          <Routes>
            <Route path="/" element={<EmployeeOutlet />}>
              <Route path="/" element={<EmpDashboard />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/emp/all-services" element={<AllService />} />
              <Route path="/emp/charts" element={<EmpHome />} />
              <Route path="/emp/all" element={<AllEmpAppointments />} />
              <Route path="emp/services/:sid" element={<EmpServiceDetail />} />
              <Route
                path="/emp/appointment/:aid"
                element={<EmpAppointmentDetails />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
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
