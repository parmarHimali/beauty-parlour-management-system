import React, { useContext } from "react";
import { FaInstagram } from "react-icons/fa";
import { FaFacebook } from "react-icons/fa";
import { IoLogoTwitter } from "react-icons/io";
import { UserContext } from "../../context/userContext";

const Footer = () => {
  const { setShowLogin } = useContext(UserContext);
  return (
    <div className="main-footer">
      <div className="sub-footer">
        <div className="footer">
          <h3>Address</h3>
          <h4> Beauty Bliss Parlour</h4>
          <p>123 Glamour Street, Suite 456, Beauty Bay, Radiance City, 78901</p>
        </div>
        <div className="footer">
          <h3>We Are Open</h3>
          <ul>
            <li>
              Monday - Sunday: <br />
              10:00 AM - 8:00 PM
            </li>
          </ul>
        </div>
        <div className="footer">
          <h3>Contact Us</h3>
          <ul>
            <li>Phone: +1 (123) 456-7890</li>
            <li>Email: beautybliss.verify@gmail.com</li>
          </ul>
        </div>
        <div className="footer">
          <h3>Follow Us</h3>
          <a href="#" className="a icons">
            <FaInstagram />
          </a>
          <a href="#" className="a icons">
            <FaFacebook />
          </a>
          <a href="#" className="a icons">
            <IoLogoTwitter />
          </a>
        </div>
      </div>
      <div className="copy-footer">
        <div>
          <span>All rights reserved 2020 </span>
          <a
            onClick={() => setShowLogin(true)}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Admin login
          </a>
        </div>
      </div>
    </div>
  );
};

export default Footer;
