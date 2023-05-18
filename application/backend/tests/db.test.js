const mongoose = require("mongoose");
const connection = require("../db");

describe("database connection", () => {
  it("should connect to the database", async () => {
    await connection();
    expect(mongoose.connection.readyState).toBe(1);
  });
});
