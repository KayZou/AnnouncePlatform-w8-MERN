import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Card } from 'react-bootstrap';
import axios from 'axios';

const JobView = () => {
  const { jid } = useParams(); // Access the job ID from the URL

  const [job, setJob] = useState(null);

  useEffect(() => {
    // Fetch the job details based on the jid parameter
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/jobs/${jid}`);
        setJob(response.data.data);
      } catch (error) {
        console.error('Error fetching job details:', error);
      }
    };

    // Execute the cleanup function
    const source = axios.CancelToken.source();

    fetchJobDetails();

    // Return the cleanup function
    return () => {
      source.cancel('Operation canceled by cleanup');
    };
  }, [jid]);

  return (
    <Container>
      <h2>Job Details</h2>
      {job ? (
        <Card>
          <Card.Body>
            <Card.Title>{job.title}</Card.Title>
            <Card.Text>{job.description}</Card.Text>
            <p>Created by: {job.creatorName || 'Unknown'}</p>
          </Card.Body>
        </Card>
      ) : (
        <div>Loading job details...</div>
      )}
    </Container>
  );
};

export default JobView;
