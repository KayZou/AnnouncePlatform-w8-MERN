import React, { useState } from "react";
import { Button, Container, Row, Col } from "react-bootstrap";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";
import Login from "../components/Login";
import Register from "../components/Register";

export default function Authenticate() {
  const [showLogin, setShowLogin] = useState(true);

  const handleToggleForm = () => {
    setShowLogin(!showLogin);
  };

  return (
    <Container className="mt-5">
      <Row>
        <Col md={{ span: 6, offset: 3 }}>
          <div className="text-center mb-4">
            <h2>{showLogin ? "Login" : "Register"}</h2>
          </div>

          {showLogin ? <Login /> : <Register />}

          <div className="text-center mt-3">
            <Button variant="link" onClick={handleToggleForm}>
              {showLogin ? (
                <>
                  <FaUserPlus className="mr-1" /> Register
                </>
              ) : (
                <>
                  <FaSignInAlt className="mr-1" /> Login
                </>
              )}
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
}
