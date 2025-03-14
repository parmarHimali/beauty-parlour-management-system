import { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  const { token } = useParams();
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewpassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `http://localhost:4000/api/users/reset-password/${token}`,
        { newPassword, confirmNewPassword },
        { withCredentials: true }
      );

      toast.success(data.message);
      setNewPassword("");
      setConfirmNewpassword("");
    } catch (error) {
      toast.error(error.response?.data?.message);
      console.log(error);
      console.log(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="otp-form">
      <div className="container">
        <div className="auth-heading">
          <h3>Reset Password</h3>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label>New Password</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Enter new password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
              />
            </div>
          </div>
          <div className="form-control">
            <label>confirm password:</label>
            <div className="input-wrapper">
              <input
                type="password"
                placeholder="Enter confirm password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewpassword(e.target.value)}
                required
              />
            </div>
          </div>
          <button type="submit">Reset Password</button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
