import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
import { FaLeftLong } from "react-icons/fa6";
import { BASE_URL } from "../../App";
import {
  MdOutlineStar,
  MdOutlineStarBorder,
  MdOutlineStarHalf,
} from "react-icons/md";

const Review = () => {
  const [reviews, setReviews] = useState([]);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const { data } = await axios.get(`${BASE_URL}/reviews/top-review`);

        setReviews(data.reviews);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="top-reviews home">
        <div className="title-section">
          <h2>Our Customer Love</h2>
          <p>
            See what our happy customers say about us! Here are the reviews from
            clients. Your satisfaction is our priority! 💖
          </p>
        </div>
        {reviews.length > 0 ? (
          reviews.map((review) => {
            const customerRatings = review.rating || 0;
            const fullStars = Math.floor(customerRatings);
            const hasHalfStar = customerRatings % 1 >= 0.5;
            const emptyStars = Math.max(
              0,
              5 - fullStars - (hasHalfStar ? 1 : 0)
            );
            return (
              <div className="reviews" key={review._id}>
                <div className="user">
                  <img src="/user.jpg" alt="profile" width={"40px"} />
                  <h4>{review.userId.name}</h4>
                  <p className="badge">{review.serviceId.name}</p>
                </div>
                <p>{review.reviewContent}</p>
                <div className="avg-rating">
                  <b>Ratings:</b>
                  <div>
                    {Array(fullStars)
                      .fill()
                      .map((_, index) => (
                        <MdOutlineStar key={`full-${index}`} color="gold" />
                      ))}
                    {/* Half star */}
                    {hasHalfStar && <MdOutlineStarHalf color="gold" />}
                    {/* Empty stars */}
                    {Array(emptyStars)
                      .fill()
                      .map((_, index) => (
                        <MdOutlineStarBorder
                          key={`empty-${index}`}
                          color="grey"
                        />
                      ))}
                  </div>
                </div>
                <small>
                  {new Date(review.reviewDate)
                    .toUTCString()
                    .split(" ")
                    .slice(0, 4)
                    .join(" ")}
                </small>
              </div>
            );
          })
        ) : (
          <h4>No data found!</h4>
        )}
      </div>
    </>
  );
};

export default Review;
