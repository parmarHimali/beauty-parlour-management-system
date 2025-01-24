import React, { useState } from "react";
import axios from "axios";
import styles from "./about.module.css";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";

const Contactus = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    message: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/contact",
        formData
      );
      alert(response.data.message);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      console.error("Error submitting the form:", error);
      alert("There was an issue submitting your form. Please try again later.");
    }
  };

  return (
    <>
      <div className={styles.aboutUs}>
        <h1 className={styles.h1Head}>About Us</h1>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <h2>Tourguiding in Berlin</h2>
            <p>
              Berlin is a city with an incredible complex history. There are
              corners on which you could stand for an hour explaining the
              different layers of history that shaped this town. The biggest
              challenge for every tour guide is to find a way to explain this
              background without boring people and losing their interest.
            </p>
            <br />
            <img
              src="/images/beauty-parlour-interior-34354001.webp"
              alt="Beauty Parlour Interior"
            />
          </div>
          <div className={styles.imageSection}>
            <img
              src="/images/1510826-cool-hair-salon-wallpaper-2560x1600.jpg"
              alt="Beauty Parlour"
            />
            <p>
              I faced this problem for the first time when I decided to give
              guided tours in the former concentration camp of Sachsenhausen
              north of Berlin. I wanted to explain to my guests not only what
              happened in this awful place, but also why it could have happened
              in the first place, what led to the Third Reich and the Holocaust,
              and what effect this has on German society nowadays.
            </p>
          </div>
        </div>
      </div>
      <hr />
      <div className={styles.counter}>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <LiaClipboardListSolid />
          </div>
          <h2 className={styles.count}>900+</h2>
          <h2 className={styles.text}>Appointments</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <FaUsers />
          </div>
          <h2 className={styles.count}>900+</h2>
          <h2 className={styles.text}>Customers</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <LiaClipboardListSolid />
          </div>
          <h2 className={styles.count}>900+</h2>
          <h2 className={styles.text}>Appointments</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <LiaClipboardListSolid />
          </div>
          <h2 className={styles.count}>900+</h2>
          <h2 className={styles.text}>Appointments</h2>
        </div>
      </div>
    </>
  );
};

export default Contactus;
