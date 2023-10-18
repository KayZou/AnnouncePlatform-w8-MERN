import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { BsFillBriefcaseFill, BsPencil } from "react-icons/bs";
import axios from "axios";

const JobForm = ({ onAddJob }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  });

  const { title, description } = formData;

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const jobData = {
      title,
      description,
    };

    const token = localStorage.getItem("token");

    axios
      .post("http://localhost:4000/api/jobs/create", jobData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        onAddJob(jobData);
        console.log("Job created:", response.data);
        // onAddJob(res => response.data.data);
      })
      .catch((error) => {
        console.error("Error creating job:", error);
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="title">
        <Form.Label>Job Title</Form.Label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <BsFillBriefcaseFill />
            </span>
          </div>
          <Form.Control
            type="text"
            name="title"
            value={title}
            onChange={handleChange}
            placeholder="Enter job title"
          />
        </div>
      </Form.Group>

      <Form.Group controlId="description">
        <Form.Label>Job Description</Form.Label>
        <div className="input-group">
          <div className="input-group-prepend">
            <span className="input-group-text">
              <BsPencil />
            </span>
          </div>
          <Form.Control
            as="textarea"
            name="description"
            value={description}
            onChange={handleChange}
            placeholder="Enter job description"
          />
        </div>
      </Form.Group>

      <Button variant="primary" type="submit">
        Create Job
      </Button>
    </Form>
  );
};

export default JobForm;
