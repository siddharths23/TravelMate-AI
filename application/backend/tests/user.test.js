// backend/tests/user.test.js
const request = require("supertest");
const { User } = require("../models/user");
const app = require("../server"); // Import your app instance

describe("POST /api/users", () => {
  afterEach(async () => {
    // Clean up the users collection after each test
    await User.deleteMany({});
  });

  test("should create a new user and return 201 status", async () => {
    const newUser = {
      firstName: "John",
      lastName: "Doe3",
      email: "johndoe3@example.com",
      password: "Password123!",
    };

    const res = await request(app).post("/api/users").send(newUser);

    if (res.status !== 201) {
      console.log("Error message:", res.body.message);
    }

    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body).toMatchObject({
      firstName: "John",
      lastName: "Doe3",
      email: "johndoe3@example.com",
    });
  });

  test("should fail to create a new user with an invalid email and return 400 status", async () => {
    const newUser = {
      firstName: "Jane",
      lastName: "Doe",
      email: "janedoe.invalidemail", // Invalid email address
      password: "Password123!",
    };

    const res = await request(app).post("/api/users").send(newUser);

    if (res.status !== 400) {
      console.log("Error message:", res.body.message);
    }

    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toContain("Email");
  });
});
