import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const RegisterEmployee = () => {
  const [services, setServices] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [speciality, setSpeciality] = useState([]);
  const [experience, setExperience] = useState("");
  const [position, setPosition] = useState("");
  const [salary, setSalary] = useState("");
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

  const handleSpecialityChange = (e) => {
    const selectedOptions = Array.from(
      e.target.selectedOptions,
      (option) => option.value
    );
    setSpeciality(selectedOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newEmployee = {
      name,
      email,
      phone,
      password,
      speciality,
      experience,
      position,
      salary,
    };

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/employee/add",
        newEmployee,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      toast.success(data.message);
      setName("");
      setEmail("");
      setPhone("");
      setPassword("");
      setSpeciality([]);
      setExperience("");
      setPosition("");
      setSalary("");
      navigateTo("/admin/employee-list");
    } catch (error) {
      toast.error(error.response?.data?.message);
    }
  };

  return (
    <div className="form-section">
      <form
        onSubmit={handleSubmit}
        style={{ width: "40%", marginTop: "10px", marginBottom: "30px" }}
      >
        <div className="title">
          <h3>Add New Employee</h3>
        </div>
        <div className="form-control">
          <label>Employee Name</label>
          <div className="input-wrapper">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label>Email Address</label>
          <div className="input-wrapper">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label>Phone Number</label>
          <div className="input-wrapper">
            <input
              type="number"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="form-control">
          <label>Password</label>
          <div className="input-wrapper">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
        </div>

        <div className="form-control">
          <label>Position</label>
          <div className="input-wrapper">
            <select
              value={position}
              onChange={(e) => setPosition(e.target.value)}
              required
            >
              <option value="">Select Position</option>
              <option value="Hair Stylist">Hair Stylist</option>
              <option value="Makeup Artist">Makeup Artist</option>
              <option value="Nail Technician">Nail Technician</option>
              <option value="Skin Care Specialist">Skin Care Specialist</option>
              <option value="Massage Therapist">Massage Therapist</option>
            </select>
          </div>
        </div>
        <div className="form-control">
          <label>Speciality</label>
          <div className="input-wrapper">
            <select
              multiple
              size={3}
              value={speciality}
              onChange={handleSpecialityChange}
            >
              {services.length > 0 &&
                services.map((service) => {
                  return (
                    <option key={service._id} value={service._id}>
                      {service.name}
                    </option>
                  );
                })}
            </select>
          </div>
        </div>

        <div className="form-control two-control">
          <div>
            <label>Salary</label>
            <div className="input-wrapper">
              <input
                type="number"
                value={salary}
                onChange={(e) => setSalary(e.target.value)}
                required
              />
            </div>
          </div>
          <div>
            <label>Experience</label>
            <div className="input-wrapper">
              <input
                type="number"
                value={experience}
                onChange={(e) => setExperience(e.target.value)}
                placeholder="experience in (year)"
              />
            </div>
          </div>
        </div>
        <button type="submit" className="btn btn-green">
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default RegisterEmployee;
