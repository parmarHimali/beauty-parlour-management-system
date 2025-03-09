// import axios from "axios";
// import React, { useEffect, useState } from "react";
// import toast from "react-hot-toast";
// import { useNavigate } from "react-router-dom";

// const RegisterEmployee = () => {
//   const [services, setServices] = useState([]);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [phone, setPhone] = useState("");
//   const [password, setPassword] = useState("");
//   const [speciality, setSpeciality] = useState([]);
//   const [experience, setExperience] = useState("");
//   const [position, setPosition] = useState("");
//   const [salary, setSalary] = useState("");
//   const navigateTo = useNavigate();

//   useEffect(() => {
//     const fetchService = async () => {
//       try {
//         const { data } = await axios.get(
//           "http://localhost:4000/api/services/all-service"
//         );
//         setServices(data.services);
//       } catch (error) {
//         console.log(error);
//       }
//     };
//     fetchService();
//   }, []);

//   const handleSpecialityChange = (e) => {
//     const selectedOptions = Array.from(
//       e.target.selectedOptions,
//       (option) => option.value
//     );
//     setSpeciality(selectedOptions);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const newEmployee = {
//       name,
//       email,
//       phone,
//       password,
//       speciality,
//       experience,
//       position,
//       salary,
//     };

//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/employee/add",
//         newEmployee,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       toast.success(data.message);
//       setName("");
//       setEmail("");
//       setPhone("");
//       setPassword("");
//       setSpeciality([]);
//       setExperience("");
//       setPosition("");
//       setSalary("");
//       navigateTo("/admin/employee-list");
//     } catch (error) {
//       toast.error(error.response?.data?.message);
//     }
//   };

//   return (
//     <div className="form-section">
//       <form
//         onSubmit={handleSubmit}
//         style={{ width: "40%", marginTop: "10px", marginBottom: "30px" }}
//       >
//         <div className="title">
//           <h3>Add New Employee</h3>
//         </div>
//         <div className="form-control">
//           <label>Employee Name</label>
//           <div className="input-wrapper">
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               required
//             />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Email Address</label>
//           <div className="input-wrapper">
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Phone Number</label>
//           <div className="input-wrapper">
//             <input
//               type="number"
//               value={phone}
//               onChange={(e) => setPhone(e.target.value)}
//               required
//             />
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Password</label>
//           <div className="input-wrapper">
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>
//         </div>

//         <div className="form-control">
//           <label>Position</label>
//           <div className="input-wrapper">
//             <select
//               value={position}
//               onChange={(e) => setPosition(e.target.value)}
//               required
//             >
//               <option value="">Select Position</option>
//               <option value="Hair Stylist">Hair Stylist</option>
//               <option value="Makeup Artist">Makeup Artist</option>
//               <option value="Nail Technician">Nail Technician</option>
//               <option value="Skin Care Specialist">Skin Care Specialist</option>
//               <option value="Massage Therapist">Massage Therapist</option>
//             </select>
//           </div>
//         </div>
//         <div className="form-control">
//           <label>Speciality</label>
//           <div className="input-wrapper">
//             <select
//               multiple
//               size={3}
//               value={speciality}
//               onChange={handleSpecialityChange}
//             >
//               {services.length > 0 &&
//                 services.map((service) => {
//                   return (
//                     <option key={service._id} value={service._id}>
//                       {service.name}
//                     </option>
//                   );
//                 })}
//             </select>
//           </div>
//         </div>

//         <div className="form-control two-control">
//           <div>
//             <label>Salary</label>
//             <div className="input-wrapper">
//               <input
//                 type="number"
//                 value={salary}
//                 onChange={(e) => setSalary(e.target.value)}
//                 required
//               />
//             </div>
//           </div>
//           <div>
//             <label>Experience</label>
//             <div className="input-wrapper">
//               <input
//                 type="number"
//                 value={experience}
//                 onChange={(e) => setExperience(e.target.value)}
//                 placeholder="experience in (year)"
//               />
//             </div>
//           </div>
//         </div>
//         <button type="submit" className="btn btn-green">
//           Add Employee
//         </button>
//       </form>
//     </div>
//   );
// };

// export default RegisterEmployee;

import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";

const RegisterEmployee = () => {
  const [services, setServices] = useState([]);
  const navigateTo = useNavigate();

  useEffect(() => {
    const fetchService = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/services/all-service"
        );
        setServices(data.services);
      } catch (error) {
        console.log(error);
      }
    };
    fetchService();
  }, []);

  const initialValues = {
    name: "",
    email: "",
    phone: "",
    password: "",
    speciality: [],
    experience: "",
    position: "",
    salary: "",
  };

  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required("Employee Name is required")
      .matches(/^[A-Za-z ]+$/, "Name must only contain alphabets"),
    email: Yup.string()
      .trim()
      .matches(
        /^[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\.[A-Za-z]{2,4}$/,
        "Invalid email format"
      )
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be 10 digits")
      .required("Phone number is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    speciality: Yup.array().min(1, "Select at least one speciality"),
    experience: Yup.number()
      .min(0, "Experience must be positive")
      .required("Experience is required"),
    position: Yup.string().required("Position is required"),
    salary: Yup.number()
      .min(0, "Salary must be positive")
      .required("Salary is required"),
  });

  const handleSubmit = async (values, { resetForm }) => {
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/employee/add",
        values,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      resetForm();
      navigateTo("/admin/employee-list");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="form-section">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, setFieldValue }) => (
          <Form
            style={{ width: "40%", marginTop: "10px", marginBottom: "30px" }}
          >
            <div className="title">
              <h3>Add New Employee</h3>
            </div>

            <div className="form-control">
              <label>Employee Name</label>
              <div className="input-wrapper">
                <Field type="text" name="name" />
                <ErrorMessage name="name" component="div" className="error" />
              </div>
            </div>

            <div className="form-control">
              <label>Email Address</label>
              <div className="input-wrapper">
                <Field type="email" name="email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
            </div>

            <div className="form-control">
              <label>Phone Number</label>
              <div className="input-wrapper">
                <Field type="text" name="phone" />
                <ErrorMessage name="phone" component="div" className="error" />
              </div>
            </div>

            <div className="form-control">
              <label>Password</label>
              <div className="input-wrapper">
                <Field type="password" name="password" />
                <ErrorMessage
                  name="password"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="form-control">
              <label>Position</label>
              <div className="input-wrapper">
                <Field as="select" name="position">
                  <option value="">Select Position</option>
                  <option value="Hair Stylist">Hair Stylist</option>
                  <option value="Makeup Artist">Makeup Artist</option>
                  <option value="Waxing Specialist">Waxing Specialist</option>
                  <option value="Nail Technician">Nail Technician</option>
                  <option value="Mehndi Artist">Mehndi Artist</option>
                  <option value="Skin Care Specialist">
                    Skin Care Specialist
                  </option>
                </Field>
                <ErrorMessage
                  name="position"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="form-control">
              <label>Speciality</label>
              <div className="input-wrapper">
                <Field
                  as="select"
                  multiple
                  size={3}
                  name="speciality"
                  value={values.speciality}
                  onChange={(e) => {
                    const selectedOptions = Array.from(
                      e.target.selectedOptions,
                      (option) => option.value
                    );
                    setFieldValue("speciality", selectedOptions);
                  }}
                >
                  {services.length > 0 &&
                    services.map((service) => (
                      <option key={service._id} value={service._id}>
                        {service.name}
                      </option>
                    ))}
                </Field>
                <ErrorMessage
                  name="speciality"
                  component="div"
                  className="error"
                />
              </div>
            </div>

            <div className="form-control two-control">
              <div>
                <label>Salary</label>
                <div className="input-wrapper">
                  <Field type="number" name="salary" />
                  <ErrorMessage
                    name="salary"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
              <div>
                <label>Experience</label>
                <div className="input-wrapper">
                  <Field
                    type="number"
                    name="experience"
                    placeholder="experience in (year)"
                  />
                  <ErrorMessage
                    name="experience"
                    component="div"
                    className="error"
                  />
                </div>
              </div>
            </div>

            <button type="submit" className="btn btn-green">
              Add Employee
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default RegisterEmployee;
