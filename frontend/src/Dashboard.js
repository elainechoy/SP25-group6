import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");

    if (token) {
      localStorage.setItem("authToken", token);
      fetchUserProfile(token);
    } else {
      navigate("/");
    }
  }, [location]);

  const fetchUserProfile = async (token) => {
    try {
      const response = await fetch("http://localhost:3001/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();

      if (data) {
        navigate("/home"); // Redirect to Home.js after login
      }
    } catch (error) {
      console.error("Failed to fetch user profile", error);
    }
  };

  return null; // Empty return since user is redirected
};

export default Dashboard;
