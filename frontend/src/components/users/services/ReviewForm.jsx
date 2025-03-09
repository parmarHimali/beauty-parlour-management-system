// import React, { useContext, useState } from "react";
// import axios from "axios";
// import toast from "react-hot-toast";
// import { MdClose } from "react-icons/md";
// import { UserContext } from "./../../../context/UserContext";

// const ReviewForm = ({ serviceId, userId, onReviewAdded }) => {
//   const [isFormVisible, setFormVisible] = useState(false);
//   const [rating, setRating] = useState(0);
//   const [reviewContent, setReviewContent] = useState("");
//   const { isAuthorized, setShowLogin } = useContext(UserContext);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!rating || !reviewContent) {
//       toast.error("Please provide both a rating and a review.");
//       return;
//     }

//     try {
//       const { data } = await axios.post(
//         "http://localhost:4000/api/reviews/add",
//         {
//           serviceId,
//           userId,
//           rating,
//           reviewContent,
//         }
//       );
//       const newReview = data.review; // New review object
//       onReviewAdded(newReview); // Add new review to the state immediately
//       toast.success("Review added successfully!");

//       setRating(0);
//       setReviewContent("");
//       setFormVisible(false);
//     } catch (err) {
//       toast.error(
//         err.response?.data?.message || "Error adding review. Please try again."
//       );
//     }
//   };

//   const handleAddReview = () => {
//     if (!isAuthorized) {
//       toast.error("Login to give review!");
//       setShowLogin(true);
//     } else {
//       setFormVisible(true);
//     }
//   };

//   return (
//     <div>
//       {!isFormVisible && (
//         <button onClick={handleAddReview} className="btn">
//           Add a Review
//         </button>
//       )}

//       {isFormVisible && (
//         <div className="auth-page show">
//           <div className="container">
//             <MdClose
//               className="close-btn"
//               onClick={() => setFormVisible(false)}
//             />
//             <h3 className="auth-heading">Add a Review</h3>
//             <form onSubmit={handleSubmit}>
//               <div>
//                 <label>Rating (1-5):</label>
//                 <input
//                   type="number"
//                   value={rating}
//                   onChange={(e) => setRating(e.target.value)}
//                   min="1"
//                   max="5"
//                 />
//               </div>
//               <div>
//                 <label>Review Content:</label>
//                 <textarea
//                   value={reviewContent}
//                   onChange={(e) => setReviewContent(e.target.value)}
//                   rows="4"
//                   cols="50"
//                 ></textarea>
//               </div>
//               <button type="submit" className="btn btn-submit">
//                 Submit Review
//               </button>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ReviewForm;
import React, { useContext, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdClose } from "react-icons/md";
import { UserContext } from "./../../../context/UserContext";
import { useFormik } from "formik";
import * as Yup from "yup";

const ReviewForm = ({ serviceId, userId, onReviewAdded }) => {
  const [isFormVisible, setFormVisible] = useState(false);
  const { isAuthorized, setShowLogin } = useContext(UserContext);

  const formik = useFormik({
    initialValues: {
      rating: "",
      reviewContent: "",
    },
    validationSchema: Yup.object({
      rating: Yup.number()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5")
        .required("Rating is required"),
      reviewContent: Yup.string()
        .min(10, "Review must be at least 10 characters")
        .required("Review content is required"),
    }),
    onSubmit: async (values, { resetForm }) => {
      try {
        const { data } = await axios.post(
          "http://localhost:4000/api/reviews/add",
          {
            serviceId,
            userId,
            rating: values.rating,
            reviewContent: values.reviewContent,
          }
        );
        onReviewAdded(data.review); // Add new review to state
        toast.success("Review added successfully!");
        resetForm(); // Clear form fields
        setFormVisible(false);
      } catch (err) {
        toast.error(
          err.response?.data?.message ||
            "Error adding review. Please try again."
        );
      }
    },
  });

  const handleAddReview = () => {
    if (!isAuthorized) {
      toast.error("Login to give a review!");
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
            <form onSubmit={formik.handleSubmit}>
              <div className="form-control">
                <label>Rating (1-5):</label>
                <div className="input-wrapper">
                  <input
                    type="number"
                    name="rating"
                    value={formik.values.rating}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    min="1"
                    max="5"
                  />
                </div>
                {formik.touched.rating && formik.errors.rating ? (
                  <p className="error">{formik.errors.rating}</p>
                ) : null}
              </div>

              <div className="form-control">
                <label>Review Content:</label>
                <div className="input-wrapper">
                  <textarea
                    name="reviewContent"
                    value={formik.values.reviewContent}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    rows="4"
                    cols="50"
                  ></textarea>
                </div>
                {formik.touched.reviewContent && formik.errors.reviewContent ? (
                  <p className="error">{formik.errors.reviewContent}</p>
                ) : null}
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
