import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import axios from "axios";
import "../css/ProfilePage.css";


/**
 * A React component that displays the user's profile information,
 * including their saved travel plans.
 * @returns {JSX.Element} The rendered ProfilePage component.
 */
const ProfilePage = () => {
  const [userName, setUserName] = useState("");
  const [travelPlans, setTravelPlans] = useState([]);
  const [collapsed, setCollapsed] = useState({});


  const toggleCollapse = (id) => {
    setCollapsed((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };


  const deletePlan = (planId) => {
    const token = localStorage.getItem("token");
    axios
      .delete(`http://localhost:5000/api/save/${planId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setTravelPlans(travelPlans.filter((plan) => plan._id !== planId));
      })
      .catch((error) => {
        console.log(error);
      });
  };


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const decoded = jwtDecode(token);
      setUserName(`${decoded.firstName} ${decoded.lastName}`);


      axios
        .get("http://localhost:5000/api/save", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setTravelPlans(response.data);
          const initialCollapsedState = response.data.reduce((acc, plan) => {
            acc[plan._id] = true;
            return acc;
          }, {});
          setCollapsed(initialCollapsedState);
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, []);


  return (
    <div className="full-screen">
      {userName ? (
        <React.Fragment>
          <h1 className="welcome">Welcome, <span style={{ color: '#F5EABC' }}>{userName}</span>!</h1>
          <p className="saved-plans">Saved Plans:</p>
          {travelPlans.map((plan) => (
            <div
              key={plan._id}
              className={`card ${collapsed[plan._id] ? "collapsed" : ""}`}
            >
              <div className="card-header">
                <h3 className="plan-name">{plan.name}</h3>
                <div className="buttons">
                  <button
                    className="collapse-btn"
                    onClick={() => toggleCollapse(plan._id)}
                  >
                    {collapsed[plan._id] ? "⯈" : "⯆"}
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => deletePlan(plan._id)}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </div>
              </div>
              {!collapsed[plan._id] && (
                <>
                  {/* <p>{plan.description}</p> */}
                  <ul className="list-days">
                    {plan.days.map((day) => (
                      <li className="day" key={day._id}>
                        <br />
                        <strong>{day.day}:</strong> {day.place}<br />
                        <br />
                        <span className="day-desc">{day.description}</span>
                      </li>
                    ))}
                  </ul>
                </>
              )}
            </div>
          ))}
        </React.Fragment>
      ) : (
        <h1>Please sign in to view your profile.</h1>
      )}
    </div>
  );
};


export default ProfilePage;