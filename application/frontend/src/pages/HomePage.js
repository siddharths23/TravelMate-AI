import React, { useState, useEffect } from "react";
import "../css/Home.css";
import { useNavigate } from "react-router-dom";
import _ from "lodash";
import { createCompletion } from "../api";
/**
 * A React component that allows users to input various travel preferences
 * and generates a travel plan based on those preferences.
 * @returns {JSX.Element} The rendered Homepage component.
 */
function Homepage() {
  const [value, setValue] = useState("");
  const [days, setDays] = useState("");
  const [interests, setInterests] = useState("");
  const [transport, setTransport] = useState("");
  const [restaurant, setRestaurant] = useState("");
  const [response, setResponse] = useState("");
  const [step, setStep] = useState(0);
  const navigate = useNavigate();
  const [isPending, setIsPending] = useState("false");

  const handleInput = async (e) => {
    e.preventDefault();
    let prompt = `Generate a travel plan in valid JSON format with the format "Day 1", "Day 2", etc. as keys, and an object with "Place" and "Description" as keys for visiting ${value}.`;
    if (days) prompt += ` The travel plan should cover ${days} days.`;
    if (interests) prompt += ` with interests in ${interests}`;
    if (transport) prompt += ` using ${transport} as the mode of transport`;
    if (restaurant)
      prompt += ` with a preference for ${restaurant} restaurants`;
    prompt +=
      ' The JSON object should look like this example: {"Day 1": {"Place": "Example Park", "Description": "A beautiful park with a lake."}, "Day 2": {"Place": "Example Museum", "Description": "A fascinating museum with a great collection."}}';
    const jsonResponse = await createCompletion(prompt);
    console.log("Generated JSON:", jsonResponse);
    setResponse(jsonResponse);
    navigate("/plan", {
      state: { plan: jsonResponse, destinationName: value },
    });
  };

  const handlePlusClick = () => {
    if (step < 4) setStep(step + 1);
  };
  const handleMinusClick = () => {
    if (step > 0) setStep(step - 1);
  };

  return (
    <div className="home-page">
      <div className="title-container section1">
        <h1 className="title-text">
          We'll plan your <span style={{ color: 'orange' }}>adventure</span>, you create your <span style={{ color: 'black' }}>story</span>!
          <p>(scroll)</p>
        </h1>
      </div>
      <div className="section2">
      <div className="homepage-container">
        <h2>Personalize Your Itinerary</h2>
        <form onSubmit={handleInput} className="search-container">
          <div class="input-container">
          <input
            className={`search-input ${step >= 0 ? "show" : ""}`}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder="Destination"
          />
          <i class="icon fas fa-plane"></i>
          </div>
          <div class="input-container">
          {step >= 1 && (
            <input
              className={`search-input ${step >= 1 ? "show" : ""}`}
              value={days}
              onChange={(e) => setDays(e.target.value)}
              placeholder="Days"
            />
          )}
          <i class="icon fas fa-calendar"></i>
          </div>
          <div class="input-container">
          {step >= 2 && (
            <input
              className={`search-input ${step >= 2 ? "show" : ""}`}
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="Interests"
            />
          )}
          <i class="icon fas fa-heart"></i>
          </div>
          <div class="input-container">
          {step >= 3 && (
            <input
              className={`search-input ${step >= 3 ? "show" : ""}`}
              value={transport}
              onChange={(e) => setTransport(e.target.value)}
              placeholder="Transport"
            />
          )}
          <i class="icon fas fa-car"></i>
          </div>
          <div class="input-container">
          {step >= 4 && (
            <input
              className={`search-input ${step >= 4 ? "show" : ""}`}
              value={restaurant}
              onChange={(e) => setRestaurant(e.target.value)}
              placeholder="Restaurant"
            />
          )}
          <i class="icon fas fa-utensils"></i>
          </div>
          <div className="plus_minus-buttons">
            <button
              type="button"
              className="plus-button pop-on-hover"
              onClick={handlePlusClick}
            >
              +
            </button>
            <button
              type="button"
              className="minus-button pop-on-hover"
              onClick={handleMinusClick}
            >
              -
            </button>
          </div>


          <button type="submit" className="search-button btn btn--svg js-animated-button">
            <span class="btn--svg__label">Search</span>
            <svg
              width="190"
              x="0px"
              y="0px"
              viewBox="0 0 60 60"
              enable-background="new 0 0 60 60"
              class="btn--svg__circle"
            >
              <circle
                fill="#FFFFFF"
                cx="30"
                cy="30"
                r="28.7"
                class="js-discover-circle"
              ></circle>
            </svg>
            <svg
              x="0px"
              y="0px"
              preserveAspectRatio="none"
              viewBox="2 29.3 56.9 13.4"
              enable-background="new 2 29.3 56.9 13.4"
              width="190"
              class="btn--svg__border"
            >
              <g
                id="Calque_2"
                class="btn--svg__border--left js-discover-left-border"
              >
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-width="0.5"
                  stroke-miterlimit="1"
                  d="M30.4,41.9H9c0,0-6.2-0.3-6.2-5.9S9,30.1,9,30.1h21.4"
                ></path>
              </g>
              <g
                id="Calque_3"
                class="btn--svg__border--right js-discover-right-border"
              >
                <path
                  fill="none"
                  stroke="#FFF"
                  stroke-width="0.5"
                  stroke-miterlimit="1"
                  d="M30.4,41.9h21.5c0,0,6.1-0.4,6.1-5.9s-6-5.9-6-5.9H30.4"
                ></path>
              </g>
            </svg>
           
          </button>
        </form>
      </div>
      </div>
     
    </div>
  );
}

export default Homepage;