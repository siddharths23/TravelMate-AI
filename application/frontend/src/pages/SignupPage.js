import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Signup.css";
import { Link } from "react-router-dom";
/**
 * A React component that renders a sign-up form for users to create a new account.
 * @returns {JSX.Element} The rendered SignupPage component.
 */

const SignupPage = () => {
  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles input field value changes by updating the corresponding state.
   * @param {Object} event - The event object containing input field data.
   */
  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  /**
   * Handles form submission by sending a sign-up request to the server.
   * On successful sign-up, it redirects the user to the login page.
   * @param {Object} event - The event object containing form data.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const url = "http://localhost:5000/api/users";
      const { data: res } = await axios.post(url, data);
      localStorage.setItem("userId", res.userId); // Save the user ID in the local storage
      navigate("/login");
      console.log(res.message);
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
    <div>
      <link rel="preconnect" href="https://fonts.googleapis.com"></link>
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossorigin
      ></link>
      <link
        href="https://fonts.googleapis.com/css2?family=Poppins:wght@600&display=swap"
        rel="stylesheet"
      ></link>
      <div class="signup-page">
        <div class="container-signup">
          <div class="side-content">
            <h1 class="welcome-text">
              Join <b>TravelMate!</b>
            </h1>
            <p>
              Experience a tailor-made travel plan with our AI-generated
              itineraries. From popular hotspots to hidden gems, we've got you
              covered. Sign up now to create your own unique itinerary or
              explore our diverse collection of curated travel plans. Let's
              travel together and make unforgettable memories!
            </p>
          </div>
          <div class="signup-container">
            <form onSubmit={handleSubmit}>
              <h2>Sign up</h2>
              <input
                type="text"
                placeholder="First Name"
                name="firstName"
                onChange={handleChange}
                value={data.firstName}
                required
                className="signup-input"
              />
              <input
                type="text"
                placeholder="Last Name"
                name="lastName"
                onChange={handleChange}
                value={data.lastName}
                required
                className="signup-input"
              />
              <input
                type="email"
                placeholder="Email"
                name="email"
                onChange={handleChange}
                value={data.email}
                required
                className="signup-input"
              />
              <input
                type="password"
                placeholder="Password"
                name="password"
                onChange={handleChange}
                value={data.password}
                required
                className="signup-input"
              />
              {error && <div className="error_msg">{error}</div>}
              <button type="submit" className="slide bottom signup-button">
                Sign up
              </button>
              <div>
                <h3 className="login-link">
                  Already a part of our community?{" "}
                  <Link to="/login" className="log-btn">
                    LOGIN
                  </Link>
                </h3>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
