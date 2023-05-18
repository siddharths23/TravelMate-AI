const router = require("express").Router();
const Plan = require("../models/User");

router.post("/plans", async (req, res) => {
  try {
    const { name, description, days } = req.body;
    const plan = new Plan({ name, description, days, user: req.user._id });
    await plan.save();
    res.status(201).send({ message: "Plan saved successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Error" });
  }
});

router.get("/plans", async (req, res) => {
  try {
    const plans = await Plan.find({ user: req.user._id });
    res.send({ plans });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Error" });
  }
});

module.exports = router;
