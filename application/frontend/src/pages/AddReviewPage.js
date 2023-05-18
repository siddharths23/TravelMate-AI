import React, { useState } from "react";
import "../css/AddReviewPage.css";
function AddReviewPage() {
  const [review, setReview] = useState({
    destination: "",
    description: "",
    rating: null,
    image: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setReview((prevReview) => ({ ...prevReview, [name]: value }));
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = function (e) {
      const img = new Image();
      img.onload = function () {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const maxWidth = 800;
        const maxHeight = 800;

        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width > height) {
            height *= maxWidth / width;
            width = maxWidth;
          } else {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const resizedImage = canvas.toDataURL(file.type);

        setReview((prevReview) => ({ ...prevReview, image: resizedImage }));
      };

      img.src = e.target.result;
    };

    reader.readAsDataURL(file);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const userId = localStorage.getItem("userId");

    if (!userId) {
      console.error("User ID not found");
      return;
    }

    const response = await fetch("http://localhost:5000/api/reviews", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        destinationName: review.destination,
        description: review.description,
        rating: review.rating,
        image: review.image,
        userId,
      }),
    });

    if (response.ok) {
      setReview({
        destination: "",
        description: "",
        rating: null,
        image: null,
      });
    }
  };

  return (
    <div className="add-review-container">
      <h1>Add Your Review</h1>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            className="dest-name"
            name="destination"
            value={review.destination}
            onChange={handleChange}
            placeholder="Destination"
            required
          />

          <textarea
            name="description"
            value={review.description}
            onChange={handleChange}
            placeholder="Tell us about your experience"
            required
          />

          <label for="images" class="drop-container">
            <span class="drop-title">Drop images here</span>
            or
            <input
              type="file"
              accept="image/jpeg, image/png"
              onChange={handleImageChange}
              required
            />
          </label>

          {review.image && <img src={review.image} alt="Review" />}

          <div className="rating">
            {[...Array(5)].map((_, i) => {
              const ratingValue = i + 1;
              return (
                <label key={i}>
                  <input
                    type="radio"
                    name="rating"
                    value={ratingValue}
                    onChange={() =>
                      setReview((prev) => ({ ...prev, rating: ratingValue }))
                    }
                  />
                  <i
                    className={
                      ratingValue <= review.rating
                        ? "fas fa-star"
                        : "far fa-star"
                    }
                  />
                </label>
              );
            })}
          </div>
          <div className="review-submit">
            <button className="submit-button" type="submit">Submit Review</button>
          </div>
          
        </form>
      </div>
    </div>
  );
}

export default AddReviewPage;
