import React from 'react';
import { useSelector } from 'react-redux';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div>
      <h2>Welcome, {user ? user.email : 'User'}</h2>
      <p>This is a protected route!</p>
    </div>
  );
};

export default Dashboard;
