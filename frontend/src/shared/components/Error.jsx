import React from 'react';

const ErrorMessage = ({ error }) => {
  if (!error) {
    return null; // If there is no error, render nothing
  }

  return (
    <div className="alert alert-danger">
      <strong>Error:</strong> {error}
    </div>
  );
};

export default ErrorMessage;
