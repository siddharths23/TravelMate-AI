import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/Plan.css";
import jwt_Decode from "jwt-decode";

/**
 * A React component that displays a generated travel plan and
 * provides the option to save the plan for the user.
 * @returns {JSX.Element} The rendered PlanPage component.
 */
function PlanPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const plan = location.state?.plan;
  const destinationName = location.state?.destinationName;
  const [savingPlan, setSavingPlan] = useState(false);
  const [savePlanError, setSavePlanError] = useState("");

  /**
   * Handles saving the travel plan to the user's profile and
   * navigates to the profile page upon successful save.
   */
  const handleSavePlan = () => {
    setSavingPlan(true);
    setSavePlanError("");
    const token = localStorage.getItem("token");
    const decoded = jwt_Decode(token);
    const userId = decoded._id;
    const planWithUserId = { ...plan, userId }; // Add user ID to the plan object
    axios
      .post("http://localhost:5000/api/saves", planWithUserId, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setSavingPlan(false);
        navigate("/profile");
      })
      .catch((error) => {
        console.error(error);
        setSavingPlan(false);
        setSavePlanError("An error occurred while saving the plan.");
      });
  };

  if (!plan) {
    return (
      <div className="plan-container">
        <h2>Plan not available. Please go back and try again!.</h2>
      </div>
    );
  }

  const handleAPI = () => {
    console.log("plan", plan);
    const data = {
      name: destinationName,
      description: "A description of my travel Plans",
      days: Object.keys(plan).map((day) => ({
        day: day,
        place: plan[day].Place,
        description: plan[day].Description,
        createdBy: getUserIdFromToken(),
      })),
    };

    fetch("http://localhost:5000/api/save", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
      body: JSON.stringify(data),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Plan could not be saved!");
        }
        return response.json();
      })
      .then((data) => {
        console.log("Plan saved successfully:", data);
        navigate("/profile");
      })
      .catch((error) => {
        console.error("There was an error saving the plan: ", error);
      });
  };

  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    const decodedToken = jwt_Decode(token);
    return decodedToken._id;
  };

  return (
    <div className="plan-page">
      <h2 className="plan-intro">Here's your generated plan:</h2>
      <div className="plan-container">
        {Object.keys(plan).map((day) => (
          <div className="plan-card" key={day}>
            <h3 className="plan-card-title">{day}</h3>
            <h4 className="plan-card-place">{plan[day].Place}</h4>
            <p className="plan-card-description">{plan[day].Description}</p>
          </div>
        ))}
      </div>
      <button className="save-button" onClick={handleAPI}>
        Save
      </button>
    </div>
  );
}

export default PlanPage;
