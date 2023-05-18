import React, { useState } from "react";

import axios from "axios";
import { Link } from "react-router-dom";
import "../css/Login.css";
/**
 * LoginPage is a functional React component that displays a login form.
 * It handles user input, form submission, and error messages.
 */
const LoginPage = () => {
  const [data, setData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  /**
   * handleChange is a function that updates the component's state with new input values.
   * @param {object} event - The input event object containing the updated input value and name.
   */
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };
  /**
   * handleSubmit is an asynchronous function that handles form submission.
   * It sends the login data to the API and stores the received token in localStorage.
   * @param {object} event - The form submit event object.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/auth";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("userId", res.userId); // Save the user ID in the local storage
      localStorage.setItem("token", res.data);
      window.location = "/";
    } catch (error) {
      if (
        error.response &&
        error.response.status >= 400 &&
        error.response.status <= 500
      ) {
        setError(error.response.data.message);
      }
    }
  };

  return (
    <div className="login-page">
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link rel="preconnect" href="https://fonts.gstatic.com"></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap"
        rel="stylesheet"
      ></link>

      <div className="container-login">
        <div className="side-content">
          <h1 className="welcome-text">
            Welcome back to <b>TravelMate!</b>
          </h1>
          <p>
            Log in to access your personalized travel plans and explore new
            destinations. TravelMate's AI-generated itineraries are designed to
            meet your specific travel preferences, ensuring an unforgettable
            experience every time.
          </p>
        </div>

        <div className="form-container">
          <form onSubmit={handleSubmit} className="login-form">
            <h2>Login</h2>
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
              value={data.email}
              required
              className="login-input"
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
              value={data.password}
              required
              className="login-input"
            />
            {error && <div className="error_msg">{error}</div>}
            <div className="btn">
              <button
                type="submit"
                className=" buttons-container login-btn slide left"
              >
                <b>Login</b>
              </button>
            </div>
            <div>
              <h3 className="signup-link">
                Don't have an account yet?{" "}
                <Link to="/signup" className="sign-btn">
                  SIGN UP
                </Link>
              </h3>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
