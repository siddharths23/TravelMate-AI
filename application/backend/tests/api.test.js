const request = require("supertest");
const app = require("../server");
const { createCompletion } = require("../services/api");

jest.mock("../services/api");

describe("GET /api/completion", () => {
  it("should return a completion from the OpenAI API", async () => {
    const mockResponse = { result: "success" };

    // Mock the createCompletion function
    createCompletion.mockImplementation(() => Promise.resolve(mockResponse));

    const prompt = "test prompt";

    const response = await request(app).get(`/api/completion?prompt=${prompt}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual(mockResponse);
  });

  it("should return a 400 error if prompt is missing", async () => {
    const response = await request(app).get("/api/completion");

    expect(response.status).toBe(400);
    expect(response.body).toEqual({ error: "Prompt is required" });
  });

  it("should return a 500 error if an error occurs during completion creation", async () => {
    const errorMessage = "Error creating completion";
    createCompletion.mockImplementation(() =>
      Promise.reject(new Error(errorMessage))
    );

    const prompt = "test prompt";

    const response = await request(app).get(`/api/completion?prompt=${prompt}`);

    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: "Internal server error" });
  });
});
