const router = require("express").Router();
const { User, validate } = require("../models/User");
const bcrypt = require("bcrypt");

router.post("/", async (req, res) => {
  try {
    const { error } = validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ email: req.body.email });
    if (user)
      return res
        .status(409)
        .send({ message: "User with given email already Exist!" });

    const salt = await bcrypt.genSalt(Number(process.env.SALT));
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const createdUser = await new User({
      ...req.body,
      password: hashPassword,
    }).save();
    // Include createdUser._id in the response body
    res
      .status(201)
      .send({
        message: "User created successfully",
        userId: createdUser._id,
        ...createdUser._doc,
      });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal  Error" });
  }
});

module.exports = router;
