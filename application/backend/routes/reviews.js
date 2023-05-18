// routes/reviews.js
const express = require("express");
const router = express.Router();
const Review = require("../models/Review");

// Get all reviews
router.get("/", async (req, res) => {
  try {
    const reviews = await Review.find();
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Creating new review
router.post("/", async (req, res) => {
  console.log(req.body);
  const review = new Review({
    userId: req.body.userId,
    destinationName: req.body.destinationName,
    description: req.body.description,
    rating: req.body.rating,
    image: req.body.image,
  });

  try {
    const newReview = await review.save();
    res.status(201).json(newReview);
  } catch (err) {
    res.status(400).json({ message: err.message, error: err });
  }
});

module.exports = router;
