import React, { useEffect, useState } from "react";
import { Container, Card, Row, Col } from "react-bootstrap";
import { BsFillBriefcaseFill } from "react-icons/bs";
import axios from "axios";

const JobList = ({ jobs }) => {
  const [creatorNames, setCreatorNames] = useState({});

  useEffect(() => {
    const fetchCreatorName = async (creatorId) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${creatorId}`
        );
        return response.data.data.username || "Unknown";
      } catch (error) {
        console.error("Error fetching creator data:", error);
        return "Unknown";
      }
    };

    const fetchAllCreatorNames = async () => {
      const names = {};

      for (const job of jobs) {
        if (!creatorNames[job.creator]) {
          names[job.creator] = await fetchCreatorName(job.creator);
        }
      }

      setCreatorNames((prevNames) => ({ ...prevNames, ...names }));
    };

    fetchAllCreatorNames();
  }, [jobs]);

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
                  <p>Created by: {creatorNames[job.creator] || "Unknown"}</p>
                </Card.Body>
              </Card>
            </Col>
          ))
        ) : (
          <Col>
            <h3>Please add a job if you are a recruiter</h3>
          </Col>
        )}
      </Row>
    </Container>
  );
};

export default JobList;
