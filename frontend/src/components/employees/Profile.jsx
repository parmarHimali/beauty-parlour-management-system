import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "../profile.module.css";
import { IoMdAdd } from "react-icons/io";
import toast from "react-hot-toast";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [preview, setPreview] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:4000/api/employee/profile",
          {
            withCredentials: true,
          }
        );
        setProfile(data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, []);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleUpload = async () => {
    if (!selectedImage || !profile?._id) return;

    const formData = new FormData();
    formData.append("image", selectedImage);

    setLoading(true);
    try {
      const { data } = await axios.patch(
        `http://localhost:4000/api/employee/changePhoto/${profile._id}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setProfile((prev) => ({
        ...prev,
        image: data.employee.image,
      }));

      toast.success(data.message);
      setPreview(null);
      setSelectedImage(null);
    } catch (error) {
      console.error("Error updating profile image:", error);
      toast.error(error.response?.data?.error || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles["profile-container"]}>
      {profile && (
        <>
          <h2>Your Profile</h2>
          <div className={styles["profile-img-wrapper"]}>
            <img src={`http://localhost:4000${profile.image}`} alt="Profile" />
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

            <div className={styles.work}>
              <h1>Work Details</h1>
              <div className={styles["p-detail"]}>
                <p>
                  <span>Salary:</span> <span>₹{profile.salary}</span>
                </p>
                <div>
                  <span>Speciality:</span>
                  <div>
                    {profile.speciality?.map((spec) => (
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
              </div>
            </div>
          </div>
        </>
      )}

      {preview && (
        <div className="popup-overlay">
          <div className="popup-content">
            <h3>Change profile</h3>
            <img
              src={preview}
              alt="your selected profile"
              className="preview-image"
            />
            <button
              onClick={handleUpload}
              disabled={loading}
              className="upload-btn"
            >
              {loading ? "Uploading..." : "Change Profile"}
            </button>
            <button onClick={() => setPreview(null)} className="cancel-btn">
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
