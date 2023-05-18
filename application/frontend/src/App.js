import React from "react";
import {
  Routes,
  Route,
  Navigate,
  BrowserRouter as Router,
} from "react-router-dom";
import PlanPage from "./pages/PlanPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import ProfilePage from "./pages/ProfilePage";
import ExplorePage from "./pages/ExplorePage";
import Homepage from "./pages/HomePage";
import ReviewPage from "./pages/ReviewsPage";
import AddReviewPage from "./pages/AddReviewPage";
import Navbar from "./components/Navbar";
import jwtDecode from "jwt-decode";

/**
 * The top-level component that sets up the router, navigation bar, and various routes.
 * @function App
 * @returns {React.Element} The rendered App component.
 */
function App() {
  const token = localStorage.getItem("token");
  let user = null;

  if (token) {
    try {
      user = jwtDecode(token);
    } catch (ex) {
      console.log("Invalid token:", ex);
    }
  }

  return (
    <Router>
      <Navbar user={user} />
      <Routes>
        {user && <Route path="/" exact element={<Homepage />} />}
        <Route path="/signup" exact element={<SignupPage />} />
        <Route path="/login" exact element={<LoginPage />} />
        <Route path="/" element={<Navigate replace to="/login" />} />
        <Route path="/plan" element={<PlanPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/explore" element={<ExplorePage />} />
        <Route path="/reviews" element={<ReviewPage />} />
        <Route path="/addreview" element={<AddReviewPage />} />
      </Routes>
    </Router>
  );
}

export default App;
