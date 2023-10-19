import React, { useEffect, useState } from 'react';
import { Container, Card, Row, Col, Button } from 'react-bootstrap';
import { BsFillBriefcaseFill } from 'react-icons/bs';
import { FaArrowRight } from 'react-icons/fa';
import {Link } from "react-router-dom"
import axios from 'axios';

const JobList = () => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        // Fetch jobs from the API
        const response = await axios.get('http://localhost:4000/api/jobs/');
        setJobs(response.data.data);
      } catch (error) {
        console.error('Error fetching jobs:', error);
      }
    };

    fetchJobs();
  }, []);

  const fetchCreatorName = async (creatorId) => {
    try {
      // Fetch user data for the given creator ID
      const response = await axios.get(`http://localhost:4000/api/users/${creatorId}`);
      return response.data.data.username || 'Unknown';
    } catch (error) {
      console.error('Error fetching creator data:', error);
      return 'Unknown';
    }
  };

  useEffect(() => {
    const updateJobsWithCreatorNames = async () => {
      const updatedJobs = await Promise.all(
        jobs.map(async (job) => {
          const creatorName = await fetchCreatorName(job.creator);
          return { ...job, creatorName };
        })
      );
      setJobs(updatedJobs);
    };

    if (jobs.length > 0) {
      updateJobsWithCreatorNames();
    }
  }, [jobs, setJobs, fetchCreatorName]);

  return (
    <Container>
      <h2>Job Listings</h2>
      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col key={job._id} lg={4} md={6} sm={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Card.Title>{job.title}</Card.Title>
                  <Card.Text>{job.description}</Card.Text>
                  <p>
                    <BsFillBriefcaseFill /> {job.company}
                  </p>
                  <p>Created by: {job.creatorName}</p>
                </Card.Body>
              </Card>
              <Link to="/dashboard"> 
            <Button variant="primary">
              Dashboard <FaArrowRight className="ml-2" />
            </Button>
          </Link>
            </Col>
          ))
        ) : (
          <Col>
            <h3>No job listings available</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default JobList;
