import React, { useContext, useEffect, useState } from "react";
import styles from "../profile.module.css"; // Import the CSS module
import axios from "axios";

import { IoMdAdd } from "react-icons/io";
const Profile = () => {
  // State for profile details
  const [profile, setProfile] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/employee/profile",
          { withCredentials: true }
        );
        console.log(data);
        setProfile(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("photo", file);
      console.log([...formData]);

      try {
        const { data } = await axios.patch(
          "http://localhost:4000/api/employee/changePhoto",
          formData,
          {
            headers: { "Content-Type": "multipart/form-data" },
          }
        );

        // 🔥 Ensure frontend displays updated image correctly
        setProfile((prev) => ({
          ...prev,
          photo: `http://localhost:4000${data.photo}`,
        }));
      } catch (error) {
        console.error(
          "Error updating profile photo:",
          error.response?.data?.error || error.message
        );
      }
    }
  };

  return (
    <div className={styles["profile-container"]}>
      {profile && (
        <>
          <h2>Your Profile</h2>

          {/* Profile Image Section */}
          <div className={styles["profile-img-wrapper"]}>
            <img src={`http://localhost:4000${profile.photo}`} alt="Profile" />
            <label className={styles["add-icon"]}>
              <IoMdAdd />
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                hidden
              />
            </label>
          </div>

          {/* Personal Details */}
          <div className={styles.mainProfile}>
            <div className={styles.personal}>
              <h1>Personal Details</h1>

              <div className={styles["p-detail"]}>
                <p>
                  <span>Name:</span> <span>{profile.userId.name}</span>
                </p>
                <p>
                  <span>Email:</span> <span>{profile.userId.email}</span>
                </p>
                <p>
                  <span>Phone:</span> <span>{profile.userId.phone}</span>
                </p>
              </div>
            </div>

            {/* Work Details */}
            <div className={styles.work}>
              <h1>Work Details</h1>

              <div className={styles["p-detail"]}>
                <p>
                  <span>Salary:</span> <span>₹{profile.salary}</span>
                </p>
                <div>
                  <span>Speciality:</span>{" "}
                  <div>
                    {profile.speciality &&
                      profile.speciality.map((spec) => (
                        <p key={spec._id}>{spec.name}</p>
                      ))}
                  </div>
                </div>
                <p>
                  <span>Experience:</span>{" "}
                  <span>{profile.experience} Years</span>
                </p>
                <p>
                  <span>Position:</span> <span>{profile.position}</span>
                </p>
                <p>
                  {/* <span>Joining Date:</span> <span>{profile.joiningDate}</span> */}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Profile;
