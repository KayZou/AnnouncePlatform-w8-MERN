import React, { useEffect, useState } from "react";
import { Container, Button } from "react-bootstrap";
import JobForm from "../../Jobs/components/JobForm";
import JobList from "../../Jobs/components/JobList";
import jwt_decode from "jwt-decode";
import axios from "axios";

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);
  const [user_id, setUser_id] = useState(null); // Added state for user ID

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setUserData(decoded);
      console.log(decoded.isUser._id);
      // Extract user ID and set it in state
      setUser_id(decoded.isUser._id);
    }
  }, [token]);

  const onAddJob = (job) => {
    setJobs((jobs) => [...jobs, job]);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch jobs for the logged-in user using user_id from state
        const response = await axios.get(`http://localhost:4000/api/jobs/user/${user_id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setJobs(response.data.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    // Make sure you have 'user_id' defined. It can come from the user data or your authentication logic.

    if (user_id) {
      fetchJobs();
    }
  }, [setJobs, user_id, token]);

  return (
    <Container>
      {userData ? (
        <>
          <h2>Dashboard of: {userData.isUser.username}</h2>
          <JobForm onAddJob={onAddJob} />
          <JobList jobs={jobs} onAddJob={onAddJob} token={token} />
        </>
      ) : (
        <Button href="/authenticate" variant="primary">
          Please login!
        </Button>
      )}
    </Container>
  );
};
export default Dashboard;
