import React from "react";
import { MdOutlineStar, MdOutlineStarBorder } from "react-icons/md";

const ReviewSection = ({ reviews }) => {
  return (
    <div className="reviews">
      <h2>Reviews</h2>
      <div className="service-reviews">
        {reviews.length >= 1 ? (
          reviews.map((rev) => (
            <div key={rev._id} className="review-content">
              <strong>{rev?.userId?.name}</strong>
              <p>{rev.reviewContent}</p>
              <div className="star-rating">
                {/* Map through the rating and display filled and empty stars */}
                {[...Array(5)].map((_, index) =>
                  index < rev.rating ? (
                    <MdOutlineStar key={index} className="filled" />
                  ) : (
                    <MdOutlineStarBorder key={index} />
                  )
                )}
              </div>
            </div>
          ))
        ) : (
          <p>No reviews available yet.</p>
        )}
      </div>
    </div>
  );
};

export default ReviewSection;
