import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Review from "../components/Review";
import "../css/ReviewsPage.css";
const ReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    const response = await fetch("http://localhost:5000/api/reviews");
    const data = await response.json();
    setReviews(data);
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredReviews = reviews.filter((review) =>
    review.destinationName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="reviews-page">
      <h1>Traveller Experiences</h1>
      <div class="search-bar">
        <i class="search-icon fas fa-search"></i>
        <input
          type="text"
          id="search-input"
          placeholder="Find new places!"
          value={searchTerm}
          onChange={handleSearch}
          
        />
      </div>
      
      {filteredReviews.map((review) => (
        <Review key={review.id} review={review} />
      ))}
      <Link to="/addreview" className="add-review-button">
        +
      </Link>
    </div>
  );
};

export default ReviewsPage;
