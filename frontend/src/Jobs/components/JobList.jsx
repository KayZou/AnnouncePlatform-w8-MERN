import React, { useEffect, useState, useCallback } from "react";
import { Container, Card, Row, Col, Button } from "react-bootstrap";
import { BsFillBriefcaseFill, BsTrash } from "react-icons/bs";
import { Link } from "react-router-dom";
import axios from "axios";

const JobList = ({ jobs, token }) => {
  const [creatorNames, setCreatorNames] = useState({});
  const [renderKey, setRenderKey] = useState(0); // State variable to trigger re-render
  const [editingJobId, setEditingJobId] = useState(null); // Store the ID of the job being edited
  const [editFormData, setEditFormData] = useState({
    title: "",
    description: "",
  });

  const reRender = useCallback(() => {
    setRenderKey((prevKey) => prevKey + 1);
  }, []);

  useEffect(() => {
    let unmounted = false; // Flag to track unmounting

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

        if (!unmounted) {
          setCreatorNames((prevNames) => ({
            ...prevNames,
            [creatorId]: response.data.data.username || "Unknown",
          }));
        }
      } catch (error) {
        if (!unmounted) {
          console.error("Error fetching creator data:", error);
        }
      }
    };

    const fetchAllCreatorNames = async () => {
      const names = {};

      for (const job of jobs) {
        if (!unmounted && !creatorNames[job.creator]) {
          names[job.creator] = await fetchCreatorName(job.creator);
        }
      }

      if (!unmounted) {
        setCreatorNames((prevNames) => ({ ...prevNames, ...names }));
      }
    };

    fetchAllCreatorNames();

    return () => {
      unmounted = true;
    };
  }, [jobs, token, reRender]);

  const deleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:4000/api/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      reRender();
    } catch (error) {
      console.error("Error deleting job:", error);
    }
  };

  const handleEditJob = (jobId, title, description) => {
    setEditingJobId(jobId);
    setEditFormData({ title, description });
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditFormData({ title: "", description: "" });
  };

  const handleUpdateJob = async (jobId) => {
    try {
      await axios.patch(
        `http://localhost:4000/api/jobs/${jobId}`,
        {
          title: editFormData.title,
          description: editFormData.description,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingJobId(null);
      setEditFormData({ title: "", description: "" });
      reRender();
    } catch (error) {
      console.error("Error updating job:", error);
    }
  };

  return (
    <Container key={renderKey}>
      <h2>Job Listings</h2>
      <Row>
        {jobs.length > 0 ? (
          jobs.map((job) => (
            <Col key={job._id} lg={4} md={6} sm={12}>
              <Card className="mb-4">
                <Card.Body>
                  <Link to={`/jobs/${job.id}`}>
                    <Card.Title>
                      {editingJobId === job._id ? (
                        <input
                          type="text"
                          name="title"
                          value={editFormData.title}
                          onChange={(e) =>
                            setEditFormData({
                              ...editFormData,
                              title: e.target.value,
                            })
                          }
                        />
                      ) : (
                        job.title
                      )}
                    </Card.Title>
                  </Link>
                  <Card.Text>
                    {editingJobId === job._id ? (
                      <textarea
                        name="description"
                        value={editFormData.description}
                        onChange={(e) =>
                          setEditFormData({
                            ...editFormData,
                            description: e.target.value,
                          })
                        }
                      />
                    ) : (
                      job.description
                    )}
                  </Card.Text>
                  <p>Created by: {creatorNames[job.creator] || "Unknown"}</p>
                  {editingJobId === job._id ? (
                    <Button
                      variant="success"
                      onClick={() => handleUpdateJob(job._id)}
                    >
                      Save
                    </Button>
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() =>
                        handleEditJob(job._id, job.title, job.description)
                      }
                    >
                      Edit
                    </Button>
                  )}
                  <Button variant="danger" onClick={() => deleteJob(job._id)}>
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
