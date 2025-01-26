import React, { useState } from "react";
import styles from "../profile.module.css"; // Import the CSS module

const Profile = () => {
  // State for profile details
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "johndoe@example.com",
    phone: "123-456-7890",
    age: "25",
    gender: "Male",
    address: "123 Street, City",
    salary: "50,000",
    speciality: "Hair Stylist",
    experience: "5 Years",
    joiningDate: "2020-06-15",
    profileImage: "/wallpaper.jpg",
  });

  const [isEditing, setIsEditing] = useState(false); // Toggle between edit and view mode
  const [selectedImage, setSelectedImage] = useState(null);

  // Handle input changes
  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  // Handle image upload
  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      const imageURL = URL.createObjectURL(e.target.files[0]);
      setSelectedImage(imageURL);
    }
  };

  // Save Changes
  const handleSave = () => {
    setProfile({
      ...profile,
      profileImage: selectedImage || profile.profileImage,
    });
    setIsEditing(false);
  };

  return (
    <div className={styles["profile-container"]}>
      <h2>Your Profile</h2>

      {/* Profile Image Section */}
      <div className={styles["profile-img-wrapper"]}>
        <img src={selectedImage || profile.profileImage} alt="Profile" />
        <label className={styles["add-icon"]}>
          +
          <input
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
        </label>
      </div>

      {/* Personal Details */}
      <div className={styles.mainProfile}>
        <div className={styles.personal}>
          <h1>Personal Details</h1>

          <div className={styles["p-detail"]}>
            <p>
              <span>Name:</span> <span>{profile.name}</span>
            </p>
            <p>
              <span>Email:</span> <span>{profile.email}</span>
            </p>
            <p>
              <span>Phone:</span> <span>{profile.phone}</span>
            </p>
            <p>
              <span>Age:</span> <span>{profile.age}</span>
            </p>
            <p>
              <span>Gender:</span> <span>{profile.gender}</span>
            </p>
            <p>
              <span>Address:</span> <span>{profile.address}</span>
            </p>
          </div>
        </div>

        {/* Work Details */}
        <div className={styles.work}>
          <h1>Work Details</h1>

          <div className={styles["p-detail"]}>
            <p>
              <span>Salary:</span> <span>{profile.salary}</span>
            </p>
            <p>
              <span>Speciality:</span> <span>{profile.speciality}</span>
            </p>
            <p>
              <span>Experience:</span> <span>{profile.experience}</span>
            </p>
            <p>
              <span>Joining Date:</span> <span>{profile.joiningDate}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
