import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "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",
  headers: {
    "User-Agent": " Chrome/58.0.3029.110",
  },
});

const openai = new OpenAIApi(configuration);

/**
 * Checks if the given string is a valid JSON object.
 * @param {string} json - The string to check for JSON validity.
 * @returns {boolean} - True if the string is valid JSON, false otherwise.
 */
function isValidJson(json) {
  try {
    JSON.parse(json);
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Fetches a completion from the OpenAI API and retries if the response is not valid JSON.
 * @param {string} prompt - The prompt to send to the API.
 * @param {number} [retries=3] - The number of retries allowed in case of failure.
 * @returns {Promise<Object>} - A Promise that resolves to the parsed JSON object from the API response.
 * @throws {Error} - An error message if a valid JSON response is not received after all retries.
 */
async function fetchCompletion(prompt, retries = 3) {
  try {
    const res = await openai.createCompletion({
      model: "text-davinci-003",
      prompt: prompt,
      max_tokens: 2000,
    });

    const responseText = res.data.choices[0].text.trim();

    // Check if the response is valid JSON
    if (responseText[0] !== "{") {
      throw new Error("Invalid JSON response");
    }

    return JSON.parse(responseText);
  } catch (error) {
    if (retries > 0) {
      console.warn("Failed to fetch completion, retrying...", error);
      return fetchCompletion(prompt, retries - 1);
    } else {
      throw new Error("Failed to get valid JSON after multiple attempts");
    }
  }
}
/**
 * Creates a completion using the OpenAI API based on the provided prompt.
 * @param {string} prompt - The prompt to send to the API.
 * @returns {Promise<Object>} - A Promise that resolves to the parsed JSON object from the API response.
 */

export async function createCompletion(prompt) {
  try {
    const jsonResponse = await fetchCompletion(prompt);
    return jsonResponse;
  } catch (error) {
    console.log(error);
  }
}
