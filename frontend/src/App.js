import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 로딩 상태를 3초 후에 false로 설정
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer); // 컴포넌트가 언마운트될 때 타이머 정리
  }, []);

  return (
    <div className="App">
      {loading ? (
        <div className="loading-container">
          <div className="progress-bar">
            <div className="progress"></div>
          </div>
          <p>Loading...</p>
        </div>
      ) : (
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>You have entered NTAV's quarantine zone.</p>
        </header>
      )}
    </div>
  );
}

export default App;
