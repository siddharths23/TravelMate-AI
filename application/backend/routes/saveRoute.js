const express = require("express");
const jwt = require("jsonwebtoken");
const router = express.Router();
const TravelPlan = require("../models/travelPlans");
const auth = require("./auth");

const getUserId = (req) => {
  const authHeader = req.header("Authorization");
  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWTPRIVATEKEY);
  return decoded._id;
};

// Define a route to handle POST requests to /api/save
router.post("/", async (req, res) => {
  try {
    // Extract the user ID from the request header
    const userId = getUserId(req);

    // Extract the travel plan data from the request body
    const { name, description, days } = req.body;

    // Create a new TravelPlan object and set its properties

    const travelPlan = new TravelPlan({
      name,
      description,
      createdBy: userId,
      days: days.map((day) => ({
        day: day.day,
        place: day.place,
        description: day.description,
      })),
    });
  

    // Save the TravelPlan object to the database
    const result = await travelPlan.save();

    // Send the saved TravelPlan object as the response
    res.json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Define a route to handle GET requests to /api/save/:userId
router.get("/", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const travelPlans = await TravelPlan.find({ createdBy: userId });
    res.json(travelPlans);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});
router.delete("/:planId", auth, async (req, res) => {
  try {
    const userId = getUserId(req);
    const planId = req.params.planId;

    const plan = await TravelPlan.findOne({ _id: planId, createdBy: userId });

    if (!plan) {
      return res.status(404).json({ error: "Travel plan not found" });
    }
    await TravelPlan.deleteOne({ _id: planId, createdBy: userId });

    res.json({ message: "Travel plan deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred" });
  }
});

module.exports = router;
