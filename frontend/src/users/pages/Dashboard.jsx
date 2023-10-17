import React, { useEffect, useState } from 'react';
import jwt_decode from 'jwt-decode';

const Dashboard = () => {
  const [userData, setUserData] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    if (token) {
      const decoded = jwt_decode(token);
      setUserData(decoded);
    }
  }, [token]);

  useEffect(() => {
    console.log('userData has changed:', userData);
  }, [userData]);

  return (
    <div className="container">
      <h2>Dashboard</h2>
      {userData && (
        <div>
          <p>Welcome, {userData.isUser.username}!</p>
          <p>Email: {userData.isUser.email}</p>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
