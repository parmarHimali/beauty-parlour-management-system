import React from "react";

const Review = () => {
  return (
    <div className="review">
      <div className="container">
        <div className="review-heading">
          <h3>Give Your Review</h3>
        </div>
        <form method="post">
          <div className="form-control">
            <label>Title</label>
            <div className="input-wrapper">
              <input type="text" placeholder="Give review title" required />
            </div>
          </div>
          <div className="form-control">
            <label>Description</label>
            <div className="input-wrapper">
              <textarea
                rows="4"
                placeholder="Give Short Description"
                required
              ></textarea>
            </div>
          </div>
          <div className="form-control">
            <label>Stars</label>
            <div className="input-wrapper">
              <select required>
                <option value="">Select Star</option>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
              </select>
            </div>
          </div>
          <button
            type="submit"
            style={{ width: "100%" }}
            className="btn-review"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  );
};

export default Review;
