import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NoPermPage from './pageComponents/noPermPage';
import ErrorPage from './pageComponents/errorPage';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Router>
      <Routes>
      <Route path="/" element={<App />} /> {/* 기본 페이지 (홈) */}
        <Route path="/login" element={<App />} /> {/* 우정님 로그인 페이지 */}
        <Route path="/noPerm" element={<NoPermPage />} /> {/* 권한 없음 페이지 */}
        <Route path="/error" element={<ErrorPage />} /> {/* 권한 없음 페이지 */}
      </Routes>
    </Router>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();



