import styles from "./about.module.css";
import { LiaClipboardListSolid } from "react-icons/lia";
import { FaUsers } from "react-icons/fa";
import { useEffect, useState } from "react";
import { TfiUser } from "react-icons/tfi";
import { GoServer } from "react-icons/go";
import axios from "axios";
import { BASE_URL } from "./../../App";

const Contactus = () => {
  const [data, setData] = useState({});
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/users/count-list`);
        console.log(data);
        setData(data.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
      <div className={styles.aboutUs}>
        <h1 className={styles.h1Head}>About Us</h1>
        <div className={styles.content}>
          <div className={styles.textSection}>
            <p>
              <strong>Welcome to Beauty & Bliss</strong>, where beauty meets
              perfection! We are dedicated to enhancing your natural beauty with
              our expert care and premium services. Our team of skilled
              professionals is committed to providing a relaxing and
              rejuvenating experience, ensuring you leave feeling confident and
              radiant.
            </p>
            <p>
              At Beauty & Bliss, we offer a <b>wide range of beauty services</b>
              , including hair styling, skincare, bridal makeup, nail art, and
              spa treatments. Using high-quality products and the latest
              techniques, we strive to deliver personalized services that cater
              to your unique needs.
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
              Your <i>satisfaction</i> is our priority, and we believe in
              creating an atmosphere that is both luxurious and comfortable.
              Whether you're preparing for a special occasion or simply
              indulging in self-care, we are here to make every visit memorable.
            </p>
            <strong>
              Visit us today and let us pamper you with the best beauty care!
              ✨💆‍♀️💅
            </strong>
          </div>
        </div>
      </div>
      <div className={styles.counter}>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <LiaClipboardListSolid />
          </div>
          <h2 className={styles.count}>{data.totalAppointments}+</h2>
          <h2 className={styles.text}>Appointments</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <FaUsers />
          </div>
          <h2 className={styles.count}>{data.totalCustomers}+</h2>
          <h2 className={styles.text}>Customers</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <TfiUser />
          </div>
          <h2 className={styles.count}>{data.totalEmployees}+</h2>
          <h2 className={styles.text}>Employees</h2>
        </div>
        <div className={styles.cardCounter}>
          <div className={styles.icon}>
            <GoServer />
          </div>
          <h2 className={styles.count}>{data.totalServices}+</h2>
          <h2 className={styles.text}>Services</h2>
        </div>
      </div>
    </>
  );
};

export default Contactus;
