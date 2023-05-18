import React from "react";
import "../css/Review.css";

const Review = ({ review }) => {
  return (
    <div className="review">
      <h2>{review.destinationName}<p>Rating: {review.rating} / 5</p></h2>
      <img src={review.image} alt="Review" />
      <p className="experience-text"><b>Experience: </b>{review.description}</p>
    </div>
  );
};

export default Review;
