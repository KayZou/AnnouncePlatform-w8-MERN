import React, { useEffect, useState } from "react";
import { Container, Row, Col, Button } from "react-bootstrap";
import JobForm from "../../Jobs/components/JobForm";
import jwt_decode from "jwt-decode";
import JobList from "../../Jobs/components/JobList";
import axios from "axios";
const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem("token");
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setUserData(decoded);
    }
  }, [token]);

  const onAddJob = (job) => {
    setJobs((jobs) => [...jobs, job]);
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch jobs for the logged-in user (replace 'user_id' with the actual user ID)
        const response = await axios.get(
          `http://localhost:4000/api/jobs/user/${user_id}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          }
        );
        setJobs(response.data.data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    // Make sure you have 'user_id' defined. It can come from the user data or your authentication logic.
    const user_id = userData ? userData.isUser._id : null;
    console.log(user_id)

    if (user_id) {
      fetchJobs();
    }
  }, [setJobs, userData, token]);

  return (
    <Container>
      {userData ? (
        <>
          <h2>Dashboard of: {userData.isUser.username}</h2>
          <JobForm onAddJob={onAddJob} />
          <JobList jobs={jobs} onAddJob={onAddJob} token={token}/>
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
