import React from 'react';
import { Container, Button } from 'react-bootstrap';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom'; // Make sure to set up your routes and use Link for navigation

const Home = () => {
  return (
    <Container className="mt-5">
      <div className="jumbotron">
        <h1 className="display-4">Announce Platform</h1>
        <p className="lead">
        Announce Platform, a web platform to create and find jobs.
        </p>
        <p className="lead">
          <Link to="/authenticate">
            <Button variant="primary">
              Get Started <FaArrowRight className="ml-2" />
            </Button>
          </Link>
        </p>
      </div>
    </Container>
  );
};

export default Home;
