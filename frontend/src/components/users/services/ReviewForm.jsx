import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { UserContext } from "./../../../context/UserContext";

const ReviewForm = ({ serviceId, userId, onReviewAdded }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const [rating, setRating] = useState(0);
  const [reviewContent, setReviewContent] = useState("");
  const { isAuthorized, setShowLogin } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!rating || !reviewContent) {
      toast.error("Please provide both a rating and a review.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/reviews/add",
        {
          serviceId,
          userId,
          rating,
          reviewContent,
        }
      );
      const newReview = data.review; // New review object
      onReviewAdded(newReview); // Add new review to the state immediately
      toast.success("Review added successfully!");

      setRating(0);
      setReviewContent("");
      setFormVisible(false);
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error adding review. Please try again."
      );
    }
  };

  const handleAddReview = () => {
    if (!isAuthorized) {
      toast.error("Login to give review!");
      setShowLogin(true);
    } else {
      setFormVisible(true);
    }
  };

  return (
    <div>
      {!isFormVisible && (
        <button onClick={handleAddReview} className="btn">
          Add a Review
        </button>
      )}

      {isFormVisible && (
        <div className="auth-page show">
          <div className="container">
            <MdClose
              className="close-btn"
              onClick={() => setFormVisible(false)}
            />
            <h3 className="auth-heading">Add a Review</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Rating (1-5):</label>
                <input
                  type="number"
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  min="1"
                  max="5"
                />
              </div>
              <div>
                <label>Review Content:</label>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  rows="4"
                  cols="50"
                ></textarea>
              </div>
              <button type="submit" className="btn btn-submit">
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReviewForm;
