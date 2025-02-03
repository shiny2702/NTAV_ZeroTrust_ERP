import React from 'react';
import '../styles/LoadingBar.css';

const LoadingBar = () => {
  return (
    <div className="loading-container">
      <div className="progress-bar">
        <div className="progress"></div>
      </div>
      <p>Loading...</p>
    </div>
  );
};

export default LoadingBar;
