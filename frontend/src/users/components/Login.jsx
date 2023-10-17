import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import axios from "axios";
import ErrorMessage from "../../shared/components/Error";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [token, setToken] = useState(null);
  
  const { email, password } = formData;
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Create an object to represent the user's login data
    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "http://localhost:4000/api/users/login",
        loginData
      );

      if (response.status === 200) {
        const receivedToken = response.data.token;
        // console.log(receivedToken);
        localStorage.setItem("token", receivedToken);

        setToken(receivedToken);
        navigate("/dashboard");
      } else {
        // Login failed, handle error
        setError("Login failed. Please check your credentials and try again.");
      }
    } catch (error) {
      console.error("Error:", error.message);
      setError("An error occurred during login.");
    }
  };
 
  return (
    <div className="container">
      <h2>Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="email">
          <div className="d-flex align-items-center">
            <FaEnvelope className="mr-2" />
            <Form.Control
              type="email"
              name="email"
              value={email}
              onChange={handleChange}
              placeholder="Enter email"
            />
          </div>
        </Form.Group>

        <Form.Group controlId="password">
          <div className="d-flex align-items-center">
            <FaLock className="mr-2" />
            <Form.Control
              type="password"
              name="password"
              value={password}
              onChange={handleChange}
              placeholder="Enter password"
            />
          </div>
        </Form.Group>

        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
      {error && <ErrorMessage error={error} />}
    </div>
  );
};

export default Login;
