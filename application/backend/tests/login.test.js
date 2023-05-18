const request = require("supertest");
const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const app = require("../server");
describe("POST /api/auth", () => {
  let user;

  beforeEach(async () => {
    // Create a new user
    user = new User({
      firstName: "John",
      lastName: "Doe3",
      email: "johndoe3@example.com",
      password: "Password123!",
    });

    // Hash the user's password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    // Save the user to the database
    await user.save();
  });

  afterEach(async () => {
    // Clean up the users collection after each test
    await User.deleteMany({});
  });

  test("should login a user and return 200 status", async () => {
    const loginUser = {
      email: "johndoe3@example.com",
      password: "Password123!",
    };

    const res = await request(app).post("/api/auth").send(loginUser);

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("data");
    expect(res.body.message).toBe("logged in successfully");
  });

  test("should fail to login a user with incorrect password and return 401 status", async () => {
    const loginUser = {
      email: "johndoe3@example.com",
      password: "WrongPassword123!", // Incorrect password
    };

    const res = await request(app).post("/api/auth").send(loginUser);

    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe("Invalid Email or Password");
  });
});
