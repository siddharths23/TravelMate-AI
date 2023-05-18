const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const Joi = require("joi");
const passwordComplexity = require("joi-password-complexity");

const TravelPlan = require("./travelPlans");

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  travelPlans: [TravelPlan.schema],
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],
});


userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, firstName: this.firstName, lastName: this.lastName },
    process.env.JWTPRIVATEKEY,
    {
      expiresIn: "7d",
    }
  );
  return token;
};

const User = mongoose.model("user", userSchema);
const complexityOptions = {
  min: 8,
  max: 50,
  lowerCase: 1,
  upperCase: 1,
  numeric: 1,
  symbol: 1,
  requirementCount: 4,
};
const validate = (data) => {
  const schema = Joi.object({
    firstName: Joi.string().required().label("First Name"),
    lastName: Joi.string().required().label("Last Name"),
    email: Joi.string().email().required().label("Email"),
    password: passwordComplexity().required().label("Password"),
    travelPlans: Joi.array()
      .items(
        Joi.object({
          name: Joi.string().required().label("Plan Name"),
          description: Joi.string().required().label("Plan Description"),
          createdBy: Joi.string().required().label("Plan Creator"),
        })
      )
      .optional()
      .label("Travel Plans"),
  });
  return schema.validate(data);
};

module.exports = { User, validate };
