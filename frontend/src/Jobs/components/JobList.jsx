import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { BsFillBriefcaseFill, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";

const JobList = ({ jobs, token }) => {
  const [creatorNames, setCreatorNames] = useState({});
  const [renderKey, setRenderKey] = useState(0); // State variable to trigger re-render

  const reRender = useCallback(() => {
    setRenderKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    const fetchCreatorName = async (creatorId) => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${creatorId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
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
  }, [jobs, token, reRender]);

  const deleteJob = async (jobId) => {
    try {
      // Send a DELETE request to the API to delete the job
      await axios.delete(`http://localhost:4000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      // Trigger re-render by updating the renderKey
      reRender();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  return (
    <Container key={renderKey}>
      {" "}
      {/* Add a key to the Container to trigger re-render */}
      <h2>Job Listings</h2>
      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col key={job._id} lg={4} md={6} sm={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Link to={`/jobs/${job.id}`}>
                    <Card.Title>{job.title}</Card.Title>
                  </Link>

                  <Card.Text>{job.description}</Card.Text>
                  <p>Created by: {creatorNames[job.creator] || "Unknown"}</p>
                  <Button
                    variant="danger"
                    onClick={() => deleteJob(job._id)} // Call the deleteJob function with the job ID
                  >
                    <BsTrash /> Delete
                  </Button>
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
